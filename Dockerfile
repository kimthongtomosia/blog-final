# Stage 1: Build Stage
FROM node:20 AS builder

# Đặt thư mục làm việc trong container
WORKDIR /src

# Copy package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./
COPY .eslintrc.js .prettierrc tsconfig*.json ./


# Cài đặt tất cả dependencies (bao gồm cả devDependencies)
RUN npm install 

# Copy toàn bộ source code vào container
COPY . .

# Stage 2: Runtime Stage
FROM node:20-slim AS production 

WORKDIR /src

# Copy toàn bộ code từ builder stage
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/package*.json ./
COPY --from=builder /src ./ 

# Cài đặt dependencies nhưng BỎ QUA devDependencies
RUN npm install -g tsx

# Expose cổng ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "run", "dev"]