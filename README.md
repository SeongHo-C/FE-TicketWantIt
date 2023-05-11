# 📌프로젝트 소개

# 티켓원잇 (one it, want it!)

![티켓원잇.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/143b247f-39b9-4e5b-9d26-3631d4bda7a3/%ED%8B%B0%EC%BC%93%EC%9B%90%EC%9E%87.png)

### 🎟️ ”저희는 전시, 공연 등 다양한 티켓을 구매 할 수 있는 서비스를 구현합니다.”

실제 소장할 수 있는 종이티켓을 구매할 수 있습니다.

좋아하는 문화생활을 맛보기 전, 설렘을 먼저 받아보세요! 🤗

# 🎟️프로젝트 주제

✨**목표**                                                                                                                                                     1. 메인페이지와 상세페이지에서 상품 정보를 확인할 수 있습니다.
2. 보기 좋고 깔끔하며 감성적인 UI
3. 회원가입, 구매, 관리자, 상품관리 등의 기본적인 기능 구현

# 👧🏻👦🏻페르소나

- 다양한 문화생활을 즐기고 싶은 20~30대.
- 예술의 알고리즘을 탐구하는 사람들

# ✨서비스 소개

<aside>
1️⃣ 회원가입, 자동 로그인,  회원정보 수정, 이메일 인증, 비밀번호 찾기 , 임시 패스워드 발급

</aside>

<aside>
2️⃣ 상품 목록 및 상품 상세 정보 조회

</aside>

<aside>
3️⃣ 장바구니에 상품 추가, 장바구니 목록 및 개별 상품 구매

</aside>

<aside>
4️⃣ 관리자 상품 및 카테고리 추가 , 수정, 삭제 및 주문정보 조회 및 상태 관리

</aside>

<aside>
5️⃣

</aside>

# ✨데모 사이트 및 데모영상

<aside>
👉🏻 [http://ticketwantit.kro.kr/](http://ticketwantit.kro.kr/)

</aside>

### 🏁데모영상

# ✨기술스택

<aside>
💡 **FRONT-END**

<aside>
📌 바닐라 자바스크립트

CSS

HTML

AXIOS

JWT

</aside>

<aside>
📌 기타 : DAUM 도로명주소 Api , remixIcon

</aside>

</aside>

<aside>
💡 **BACK-END**

<aside>
📌 mongodb 
Node.js 
Express.js 
mongoose
multer
Passport
Nginx
jsonwebtoken
nodemailer

</aside>

</aside>

<aside>
💡 협업툴 : 깃랩 , 노션,  pigma , postman , gather town, discord

</aside>

# ✨ 프로젝트 구조

### 🏁서비스 구조

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5a6f8eba-a0ea-49f3-9b14-fd8ee614004f/Untitled.png)

### 🏁파일구조

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c95dd71c-dcf4-4247-95c7-a672b5ca626f/Untitled.png)

# ✨ 구성원 역할

| 이름                                                                                | 역할                                                                                                                                             |
| --- | --- |
|  🐷윤우정 | 팀장 , FE  
$\color{gray}\rule{330px}{0.5px}$ |
|  🐭김윤중 | 팀원 , FE
$\color{gray}\rule{330px}{0.5px}$[유저]: 유저 정보조회, 유저 정보수정페이지(마이페이지) UI 및 기능 구현
[로그인]: 회원가입, 로그인, 비밀번호 초기화, 비밀번호 변경 UI 및 기능 구현 |
| 🐯이민영 | 팀원 , BE 
$\color{gray}\rule{330px}{0.5px}$
[관리자] : 상품 추가, 수정, 삭제 / 카테고리 추가, 수정, 삭제
[메인] : 메인 페이지 NEW_ARRIVALS 목록, MD 추천 목록 / 전체 상품 조회, 카테고리별 상품 조회, 상품 상세  |
| 🐯정혜린 | 팀원 , BE $\color{gray}\rule{330px}{0.5px}$
[관리자] : 전체 주문 조회,  관리자 주문 취소, 관리자 주문상태 변경, 특정 유저의 주문내역 조회
[유저] : 유저 본인의 주문조회, 배송전 주문취소, 배송지 및 번호 수정, 주문하기 |
| 🐰이성호 | 팀원 , FE
$\color{gray}\rule{330px}{0.5px}$[유저] : 상품 상세 페이지, 장바구니 페이지, 주문/결제 페이지, 주문 완료 페이지, 주문 조회 페이지(마이페이지) UI 및 기능 구현 |
| 🐍유하영 | 팀원 , BE
$\color{gray}\rule{330px}{0.5px}$
[사용자]: 회원가입(비밀번호 해쉬화,이메일인증), 유저 정보조회, 유저 정보수정, 회원탈퇴
[로그인]: JWT토큰 발급,  관리자계정과 일반계정 구분,   자동로그인, 비밀번호 초기화 
[검증]: JWT검증미들웨어 사용, 만료시간 후 토큰 재발급 |

# ✨ 코드 컨벤션 및 커밋메시지 컨벤션

## ✅ **변수, 함수명에 대한 Naming Convention**

### 1️⃣ **변수, 함수, 인스턴스**

변수, 함수, 인스턴스를 작성할 때는 *Camel Case(카멜 케이스)*를 사용합니다.

<aside>
⚠️ ex) camelCase

<div id=”userName”>
<div class=”user_name”>

</aside>

### 2️⃣ **함수명 작성**

함수명을 작성할 때는 동사+명사 형태로 구성합니다.

<aside>
⚠️ ex) getUserInfomation()

</aside>

### 3️⃣ **Class, Constructor**

Class, Constructor를 작성할 때는 *Pascal Case(=upper 카멜 케이스)*를 사용합니다.

<aside>
⚠️ ex) CamelCase

</aside>

### 4️⃣ **글자의 길이**

글자의 길이는 **20자 이내로 제한**합니다.

4 단어 이상이 들어가거나, 부득이하게 20자 이상이 되는 경우 팀원과의 상의를 거칩니다.

### 5️⃣ **Flag로 사용되는 변수**

플래그(Flag)란 '깃발'이란 의미이지만, 프로그래밍에서는 '상태를 기록하고 처리 흐름을 제어하기 위한 boolean 변수'를 의미합니다.

<aside>
⚠️ Boolean의 경우 조동사+flag 종류로 구성됩니다. ex) isNum, hasNum

</aside>

### 6️⃣ **약칭의 사용**

약어는 되도록 사용하지 않는 것이 좋습니다. 부득이하게 약어가 필요하다고 판단되는 경우 팀원과의 상의를 거쳐봅시다.

<aside>
⚠️ let idx; // bad

</aside>

### 7️⃣ M****agic number 지양****

## ✅ Git Commit Message

### 레퍼런스

[https://overcome-the-limits.tistory.com/entry/협업-협업을-위한-기본적인-git-커밋컨벤션-설정하기](https://overcome-the-limits.tistory.com/entry/%ED%98%91%EC%97%85-%ED%98%91%EC%97%85%EC%9D%84-%EC%9C%84%ED%95%9C-%EA%B8%B0%EB%B3%B8%EC%A0%81%EC%9D%B8-git-%EC%BB%A4%EB%B0%8B%EC%BB%A8%EB%B2%A4%EC%85%98-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)

[https://richone.tistory.com/26](https://richone.tistory.com/26)

### 커밋메세지 정리

| 요약어 | 기능설명 |
| --- | --- |
| FEAT | 새로운 기능의 추가 |
| FIX | 버그 수정 |
| DOCS | 문서 수정 |
| STYLE | 스타일 관련 기능(코드 포맷팅, 세미콜론 누락, 코드 자체의 변경이 없는 경우) |
| REFACTOR | 코드 리펙토링 |
| TEST | 테스트 코트, 리펙토링 테스트 코드 추가 |
| CHORE | 빌드 업무 수정, 패키지 매니저 수정(ex .gitignore 수정 같은 경우) |

### **커밋메세지 작성시 추가 규칙**

1. **제목 행을 50자로 제한**
    
    <aside>
    ⚠️ 강제로 제한하는 것은 아니고 읽기 쉽고 간결하게 표현하기 위한 경험에 의한 규칙이다
    
    </aside>
    
2. **제목 행의 첫 글자는 대문자로 시작**
    
    <aside>
    ⚠️ readme file modification **X**
    Readme file modification **O**
    
    </aside>
    
3. **제목 행 끝에 마침표를 넣지 않는다**
    
    <aside>
    ⚠️ 제목 행의 끝에는 마침표가 필요 없다.
    50자 규칙에 따르기 위해서라도 마침표를 넣는 것은 불필요한 공간 낭비이다
    
    Open the door. **X**
    
    Open the door **O**
    
    </aside>
    
4. **제목 행에 명령문을 사용한다**
    
    <aside>
    ⚠️ "명령이나 설명하듯이 작성"
    
    네 방을 치운다 (Clean your room)
    
    문을 닫는다 (Close the door)
    
    쓰레기를 갖다 버린다 (Take out the trash)
    
    </aside>
    

# 📜**API 명세서**

- 유저/ 관리자 주문 API 명세서

[https://documenter.getpostman.com/view/24299810/2s93eU3uKv](https://documenter.getpostman.com/view/24299810/2s93eU3uKv)
