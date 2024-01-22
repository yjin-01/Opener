FROM node:14

# Docker container 안의 기본 workdir를 /usr/src/app으로 설정
WORKDIR /usr/src/app

# 현재 프로젝트의 package.json, package-lock.json을 docker container의 /usr/src/app로 복사
COPY package*.json ./

# 이미지 빌드시 실행되는 명령어입니다.
# 프로덕션을 위한 코드를 빌드하는 경우
RUN npm ci --only=production

# .dockerignore에 지정되어있는 파일 제외한 모든 파일을 docker container의 /usr/src/app로 복사
COPY . .

# docker container의 3000번 포트
# EC2 내부에서는 해당 이미지를 사용하는 docker container의 3000번 포트에 접근
EXPOSE 3000

# 이미지가 실행되어 docker container가 되는 시점에 실행될 명령어
CMD ["npm", "run", "start:prod"]