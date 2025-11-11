# CI/CD Automation Guide for Home Admin

This guide walks through every step required to automate deployments of the Home Admin project from GitHub to a Linux server using Docker and GitHub Actions. Follow the sections in order to go from a clean server to fully automated deployments.

---

## Prerequisites

- Linux server (tested on Ubuntu 22.04) with SSH access
- Docker Engine and Docker Compose plugin installed
- A GitHub repository containing the Home Admin codebase
- SSH key pair available for GitHub Actions to log into the server
- Basic familiarity with SSH and Git

---

## 1. Prepare the Server

1. **Install Docker and Compose** (skip if already installed)

   ```bash
   sudo apt update
   sudo apt install -y ca-certificates curl gnupg lsb-release
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   sudo usermod -aG docker $USER
   ```

   Log out and back in so Docker permissions take effect.

2. **Create a working directory**

   ```bash
   mkdir -p ~/web-apps/home-admin
   cd ~/web-apps/home-admin
   ```

3. **Clone the repository**

   ```bash
   git clone https://github.com/<your-org>/home-admin.git .
   ```

4. **Create the environment file**

   ```bash
   cp .env.example .env   # or: touch .env
   nano .env
   ```

   Populate with production values, for example:

   ```
   NODE_ENV=production
   USE_DATABASE=true
   DATABASE_URL=postgresql://postgres:StrongPassword@postgres:5432/home_admin
   DEMO_USER_EMAIL=demo@homeadmin.ro
   DEMO_USER_PASSWORD=demo123
   DEMO_USER_NAME=Demo User
   DEMO_USER_ROLE=user
   ```

5. **Adjust Docker Compose ports if needed**

   Edit `docker_compose.yml` to ensure host ports do not conflict with other services. Example:

   ```yaml
   services:
     postgres:
       ports:
         - "5540:5432"
     app:
       ports:
         - "3080:3000"
   ```

6. **Start the stack locally once**

   ```bash
   docker compose -f docker_compose.yml up -d
   docker compose -f docker_compose.yml logs -f app
   ```

   Visit `http://<server-ip>:3080` (or your chosen port) to verify the app runs. When satisfied, keep the containers running; future deployments will replace them.

---

## 2. Configure SSH for GitHub Actions

1. **Generate an SSH key pair on your local machine**

   ```bash
   ssh-keygen -t ed25519 -C "github-actions deploy" -f ~/.ssh/home-admin-deploy
   ```

2. **Install the public key on the server**

   ```bash
   ssh <server-user>@<server-host>
   mkdir -p ~/.ssh
   cat ~/.ssh/home-admin-deploy.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Test login**

   ```bash
   ssh -i ~/.ssh/home-admin-deploy <server-user>@<server-host>
   ```

   Ensure you land in the shell without a password prompt (unless you set one).

---

## 3. Create GitHub Secrets

In the GitHub repository, navigate to **Settings → Secrets and variables → Actions** and add the following repository secrets:

| Secret Name       | Value Example                              | Purpose                                 |
|-------------------|---------------------------------------------|-----------------------------------------|
| `SERVER_HOST`     | `your.server.ip` or domain                  | SSH target host                         |
| `SERVER_USER`     | `hurmuzache` (or the account you use)       | SSH username                            |
| `SERVER_SSH_KEY`  | Contents of `~/.ssh/home-admin-deploy`      | Private key for CI/CD access            |
| `DEPLOY_PATH`     | `/home/<user>/web-apps/home-admin`          | Absolute path to the project on server |

Ensure there are no surrounding quotes or extra spaces when pasting secret values.

---

## 4. GitHub Actions Workflow

The repository already contains `.github/workflows/deploy.yml`. It performs the following actions on every push to `main` (and on manual dispatch):

1. **Checkout** current repository code.
2. **Start SSH agent** and load the `SERVER_SSH_KEY`.
3. **Sync files** from GitHub runner to the server using `rsync` (excludes `.git` and workflow files).
4. **Run Docker Compose** commands on the server to pull, rebuild, and restart containers.

Verify the workflow references the existing secrets:

```yaml
env:
  DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}

steps:
  - uses: actions/checkout@v4
  - uses: webfactory/ssh-agent@v0.9.0
    with:
      ssh-private-key: ${{ secrets.SERVER_SSH_KEY }}
  - uses: burnett01/rsync-deployments@v5.2
    with:
      remote_host: ${{ secrets.SERVER_HOST }}
      remote_user: ${{ secrets.SERVER_USER }}
      remote_path: ${{ env.DEPLOY_PATH }}
  - name: Rebuild and restart containers
    run: |
      ssh -o StrictHostKeyChecking=no ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} <<'EOF'
      cd ${DEPLOY_PATH:-/opt/home-admin}
      docker compose pull
      docker compose build app
      docker compose up -d
      EOF
```

---

## 5. Trigger the Workflow

1. Commit and push the workflow update (already in the repo).
2. Push any change to the `main` branch or manually run the workflow from the **Actions** tab (`Deploy → Run workflow`).
3. Monitor the workflow logs. A successful run should show the rsync transfer followed by Docker commands completing with exit code 0.
4. On the server, validate the application:

   ```bash
   docker compose -f docker_compose.yml ps
   docker compose -f docker_compose.yml logs app | tail
   ```

   The app should be reachable at the host port you configured (`http://<server-ip>:3080` in the example).

---

## 6. Ongoing Operations

- **Redeploy on demand:** Use “Run workflow” in GitHub Actions to redeploy without code changes.
- **Update secrets:** If server IP, user, or path changes, update the corresponding secrets.
- **Backups:** Database data persists in the `postgres_data` volume. Use `docker compose exec postgres pg_dump ...` or volume snapshots for backups.
- **Port adjustments:** If future services conflict, edit `docker_compose.yml` host ports and redeploy.
- **Log inspection:** For debugging, use `docker compose -f docker_compose.yml logs -f app` and `docker compose -f docker_compose.yml logs -f postgres`.

---

## 7. Optional Enhancements

- **Reverse Proxy & HTTPS:** Add Nginx or Caddy in front of the app container to provide TLS termination and nicer domains.
- **Staging/Production Branches:** Duplicate the workflow with different secrets and paths for multiple environments.
- **Docker Image Registry:** Build and push Docker images in GitHub Actions, then pull on the server to reduce build times on the host.
- **Systemd Wrapper:** Create a systemd service that runs `docker compose up -d` on boot for easier recovery after reboots.

---

## Summary

By following this guide you:

1. Prepared a Linux server with Docker and initial Home Admin deployment.
2. Configured passwordless SSH access for GitHub Actions.
3. Added GitHub repository secrets to store connection details securely.
4. Enabled an automated GitHub Actions workflow that syncs code and restarts Docker containers on every push.

From now on, pushing to `main` keeps the server up to date without manual intervention. Update the environment file or Docker configuration directly on the server when necessary, and let the workflow handle the rest. Enjoy your automated CI/CD pipeline!

