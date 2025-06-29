네, 알겠습니다. 기존 기능에 새로운 기능들을 추가하여 페이지별로 정리한 `README.md`의 '주요 기능' 섹션을 다시 작성해 드리겠습니다.

-----

# gpt-test-chat-summarize

이 프로젝트는 채팅 내용을 분석하고 요약하는 웹 애플리케이션입니다. 환자와 파트너 간의 원활한 소통과 기록 관리를 돕는 것을 목표로 합니다.

## ✨ 주요 기능

  - **회원 관리**
      - 회원가입 시 역할(환자, 파트너) 선택
      - **프로필 페이지**
          - 환자: 등록된 파트너 목록(이름, 연락처) 확인
          - 파트너: 등록된 환자 목록(이름, 연락처) 확인
  - **파트너 연동**
      - 환자는 파트너를 초대하기 위한 코드를 생성할 수 있습니다.
      - 파트너는 전달받은 코드를 통해 특정 환자의 파트너로 등록할 수 있습니다.
  - **프로젝트 페이지**
      - **프로젝트 관리**
          - 대화 내용을 관리할 프로젝트 생성
          - 프로젝트 이름 클릭 시 이름 수정 기능 (저장/취소)
      - **채팅 분석**
          - `CSV` 파일(`Date`, `Name`, `Message`)을 가져와 분석
          - 과거 분석 내역을 리스트로 확인하고 선택하여 조회
      - **요약 및 채팅 기록 (Summary & Chat Log)**
          - `New Summary` 버튼으로 새로운 분석 생성
          - 요약 목록 더보기/접기(`Show more/less`) 기능
          - 채팅 기록 및 분석 결과 영역 스크롤 기능
          - 채팅 기록 테이블의 컬럼(Column) 가로 길이 조절 기능
      - **AI 답변 추천**
          - (나의 추천 답변) 채팅 기록 기반 추천 답변 3개 제공
          - (상대의 예상 답변) 채팅 기록 기반 상대의 예상 답변 3개 제공
  - **환경설정**
      - 언어 변경 기능 (ex. French 선택 시 UI 텍스트 변경)
  - **사용성 개선**
      - 작업 중 페이지를 새로고침해도 로그인 페이지로 이동하지 않도록 세션 유지
      - 파일 Import 시, 채팅 데이터를 제외한 UI 텍스트는 설정된 시스템 언어로 표시

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

### 1\. 데이터베이스 설정

MySQL에 접속하여 데이터베이스를 생성하고, `gpt-test-backend`의 `application.yml` 파일 설정을 확인해주세요.

### 2\. 벡엔드 실행

```bash
cd gpt-test-backend
./gradlew build
./gradlew bootRun
```

### 3\. 프론트엔드 실행

```bash
cd gpt-test-frontend
npm install
npm run dev
```

프론트엔드 애플리케이션은 http://localhost:3000 에서 실행됩니다.

## 📁 디렉토리 구조

```
.
├── gpt-test-backend/   # Spring Boot 벡엔드
└── gpt-test-frontend/  # Next.js 프론트엔드
```