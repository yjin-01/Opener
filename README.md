# 🎉 Opener
### 비공식 오프라인 K-pop 행사를 한 눈에 볼 수 있는 사이트

Opener는 K-pop 팬을 위한 오프라인 행사 정보를 한 곳에서 쉽게 확인할 수 있는 웹사이트입니다.<br/>
각종 카페 이벤트부터 팬광고, 전시회 등 다양한 이벤트 정보를 등록하고, 한눈에 찾아볼 수 있습니다!<br/>

🙌 배포 URL: https://www.myopener.kr/

⏰ 개발기간
- 2024.01.22 ~ 2024. 02. 22 (Ver 1.0)
- 2024.02.26 ~ ing (Ver 2.0)

<br/>
<br/>

# 🛠 기술 스택
<p align="center">
<img alt= "icon" wide="65" height="65" src ="https://docs.nestjs.com/assets/logo-small.svg">
<img alt= "icon" wide="80" height="80" src ="https://techstack-generator.vercel.app/ts-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/mysql-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://techstack-generator.vercel.app/restapi-icon.svg">
<img alt= "icon" wide="65" height="65" src ="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png">
</p>

<br/>
<br/>

# 👩🏻‍💻 기능 구현
- ### 공통 구현
  - Database
    - 정규화를 기반으로 한 ERD 모델링
 
  - Swagger

- ### 행사 API
  - 행사 CRUD 구현
  - 조건별 검색 API 구현
  - DB transaction 구현

- ### 아티스트 & 그룹 API
  -  아티스트 & 그룹 등록 작업
  -  조회 API

- ### 이미지 업로드 API
  - AWS S3 이미지 업로드 구현 


<br/>
<br/>

# 🔎 DB ERD
<img wide="100%"  src ="https://github.com/yjin-01/cumadi-server/blob/main/public/mcb_ERD.png?raw=true">

<br/>
<br/>

# 🔗 시스템 아키텍쳐
<img wide="100%"  src ="![image](https://github.com/yjin-01/Opener/assets/92343369/6ef80e94-0cb5-4eb0-9d99-1fdb4d080782)
">

<br/>
<br/>


# ⚙️ .env 설정

```
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE=
DATABASE_DIRECT=
ENTITIES=
POOL_SIZE=


AWS_S3_ACCESS_KEY=
AWS_S3_SECRET_KEY=
AWS_S3_REGION=
AWS_S3_BUCKEY_NAME=



ACCESS_SECRET=
REFRESH_SECRET=
COUNT=
```



