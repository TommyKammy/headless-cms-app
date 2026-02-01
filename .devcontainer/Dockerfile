# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Set working directory
WORKDIR /workspace

# Install additional system tools (root)
RUN apt-get update && apt-get install -y \
    zsh \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Switch to non-root user 'node' for npm global installs
USER node

# opencode-ai と oh-my-opencode をインストール
RUN npm install -g opencode-ai oh-my-opencode

# Create .zshrc and add configuration
# (ヒアドキュメント構文エラー回避のため printf を使用する安全策をとっています)
RUN touch ~/.zshrc && printf '\n\
# ===== Configuration =====\n\
export PATH="$(npm config get prefix)/bin:$PATH"\n\
export OH_MY_OPENCODE_ENABLED=true\n\
\n\
if [ -f /workspace/.oh-my-opencode/aliases.zsh ]; then\n\
  source /workspace/.oh-my-opencode/aliases.zsh\n\
fi\n\
' >> ~/.zshrc

# Switch back to root to copy init script (optional, but good practice for file permissions)
USER root

# Copy initialization script
COPY init.sh /tmp/init.sh
RUN chmod +x /tmp/init.sh
