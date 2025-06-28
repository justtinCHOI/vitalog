# gpt-test-chat-summarize

이 프로젝트는 채팅 내용을 분석하고 요약하는 웹 애플리케이션입니다. 환자와 파트너 간의 원활한 소통과 기록 관리를 돕는 것을 목표로 합니다.

## ✨ 주요 기능

- **회원가입**
    - 이름
    - 역할 (환자, 파트너)
    - 환자/파트너 정보
    - 연락처
- **파트너 초대**
    - 환자는 파트너를 초대하기 위한 코드를 생성할 수 있습니다.
    - 파트너는 전달받은 코드를 통해 특정 환자의 파트너로 등록할 수 있습니다.
- **프로젝트 관리**
    - 대화 내용을 관리할 프로젝트를 생성할 수 있습니다.
- **채팅 파일 가져오기**
    - `Date`, `Name`, `Message` 컬럼으로 구성된 CSV 형식의 채팅 파일을 가져올 수 있습니다.
- **채팅 분석**
    - 가져온 채팅 내용을 분석하고 요약하는 기능을 제공합니다.

## 🛠️ 기술 스택

### 벡엔드 (gpt-test-backend)
- Spring Boot 3.3.1
- Java 21
- Gradle
- Spring Web
- Spring Security
- Spring Data JPA
- Lombok
- Validation
- OpenFeign
- MySQL Connector
- JWT

### 프론트엔드 (gpt-test-frontend)
- Next.js 15
- React 19
- TypeScript
- Axios
- Tailwind CSS

### 데이터베이스
- MySQL

## 🚀 시작하기

### 사전 준비 사항
- Java 21
- Node.js
- MySQL

### 1. 데이터베이스 설정
MySQL에 접속하여 데이터베이스를 생성하고, `gpt-test-backend`의 `application.yml` 파일 설정을 확인해주세요.

### 2. 벡엔드 실행
```bash
cd gpt-test-backend
./gradlew build
./gradlew bootRun
```

### 3. 프론트엔드 실행
```bash
cd gpt-test-frontend
npm install
npm run dev
```
프론트엔드 애플리케이션은 `http://localhost:3000` 에서 실행됩니다.

## 📁 디렉토리 구조
```
.
├── gpt-test-backend/   # Spring Boot 벡엔드
└── gpt-test-frontend/  # Next.js 프론트엔드
``` 