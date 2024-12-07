# Sử dụng Node.js làm base image
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json vào container
COPY . .

# Cài đặt các dependencies (bao gồm Vite)
RUN npm install

# Sao chép mã nguồn còn lại vào container
COPY . .

# Mở cổng cho Vite
EXPOSE 5173

# Khởi động ứng dụng với Vite
CMD ["npm", "run", "dev"]
