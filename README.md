# zoom-clone

줌 클론코딩 따라하기

## pug (템플릿 엔진)

자바스크립트를 사용하여 HTML 렌더링할 수 있게 해준다.
HTML문법과 살짝 다르며 자바스크립트 문법이 들어가기도 한다.
pug는 express의 패키지 view engine이다.

## nodemon

nodemon 은 내 프로젝트를 살피면서 변경 사항이 있을 시 서버를 재시작해준다.

## babel (core, cli, node, preset) 설치

Babel 은 작성된 Javascript코드를 일반 NodeJS코드로 컴파일 해준다.

## package.json 파일에 "scripts" 추가

`package.json`

```json
"scripts": {
  "dev": "nodemon"
},
```

- `yarn dev`로 실행

## express 서버 만들기

`yarn add express`

1. server.js 파일 생성
   `server.js`

```javascript
import express from 'express'

const app = express()

app.set('view engine', 'pug')
// view engine 으로 pug 를 사용하도록 셋팅
app.set('views', __dirname + '/views')
// 기본적으로 render 함수 실행 시, src/views 폴더안의 파일을 읽도록 셋팅
app.use('/public', express.static(__dirname + '/public'))
// 유저가 /public으로 가게되면 __dirname + "/public" 폴더를 보여주도록 설정
app.get('/', (req, res) => res.render('home'))
// "/" 에서 home 파일을 render 하도록 설정

console.log('Hello')

const handleListen = () => console.log('locall 호스트 3000')

app.listen(3000, handleListen)
```

2. pug 페이지 렌더하기 위해 views 폴더에 home.pug 파일 만들기
3. FrontEnd js 를 수정할 때는 nodemon 이 서버를 재시작하지 않도록 설정
   `nodemon.json`

```json
{
  "ignore": ["src/public/*"]
}
```

4. mvp 초기 세팅

```pug
link(rel="stylesheet", href="https://unpkg.com/mvp.css")
```

5. 초기 세팅
   ![screenshot](https://velog.velcdn.com/images%2Fevencoding%2Fpost%2F509331c1-5885-4c90-9474-83f9e5aaf4e8%2Fimage.png)
