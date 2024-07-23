---
{
  title: '[Vue]  Quasar Vue UI framwork 소개',
  subtitle: '',
  timestamp: 1646209620,
  outline: 'deep',
  tags: ['vue', 'vue3', 'Quasar', 'Framework'],
  layout: 'doc',
  mainImg: '/images/Vue.jpg',
}
---

회사에서 사용 중인 Vue UI 프레임워크를 소개해보려고 한다.
Vue 사용자도 React에 비해 많이 적은 와중에 UI 프레임워크는 보통 Vuetify를 많이 사용한다.
Quasar를 처음 접했을 때 검색하기 참 힘들었던 거 같다.

## 1. 공식 사이트

https://quasar.dev/

::: embed-url https://quasar.dev/ :::

Vuetify 와는 다르게 문서가 좀 더 깔끔하고 상냥한 거 같다.
상단에 컴포넌트의 설명을 검색도 가능하게 해 준 뒤 예제들을 종류별로 다 뿌려두었다.
Vuetify는 직접 태그를 추가하며 확인해보는 것에 비해 Quasar는 필요한 걸 바로 확인하고 소스를 긁어 갈 수 있어서 좋았다.

## 2. Quasar Cli

Quasar는 전용 cli를 지원한다.  
Vue 초기 세팅을 못하는 사람이라도 cli를 쓰면 빠르게 세팅이 가능하다.  
기본적으로 Typescript와 Vuex, vue-router 등을 지원하고 전역 함수와 전역 스타일을 정리할 수 있게 따로 정리를 해두었다.

기본적으로 SPA(싱글 페이지 애플리케이션)으로 동작하지만 Electron을 사용하여 프로그램으로 빌드하거나 Cordova나 Capacitor를 통해 앱으로 빌드할 수 있다.  
PWA도 지원하여 웹을 간단하게 앱으로 만들어버릴 수도 있다.  
서버사이드 랜더링 역시 지원하고 있다.

우선 npm 명령어를 통해 전역으로 Quasar를 설치해준다.  
( Quasar는 yarn으로 하길 원하지만 나는 npm이 편하다. )

```bash
$ yarn global add @quasar/cli
# or
$ npm install -g @quasar/cli
```

cli를 설치한 뒤 프로젝트를 세팅할 폴더에 가서 quasar create <폴더명>을 해준다.

```bash
quasar create <폴더명>
```

eslint나 typescript 등을 선택해주고 css의 전처리기 등등을 선택해주고 나면 기초적인 세팅이 끝난 Vue 프로젝트가 생성된다.

vue.conf.js 대신 quasar.conf.js가 있다. 여기서 퀘이사 cli를 사용하며 필요한 설정, 빌드 타입 등을 설정해줄 수 있다.

quasar.conf.js에 framwork에 lang을 ko-kr로 설정해야 언어가 한국어로 나온다.
달력이 영어로 나오길래 한번 찾아봤었다.

## 3. 전용 Directive

![quasar directive](/images/quasar-directive.png)
유용한 Directive도 지원한다.

다 살펴 보진 않았지만 Close Popup은 조건에 따라 QMenu나 QDialog 등의 Quasar가 지원하는 팝업 컴포넌트를 Close (hide) 처리 할 수 있다.

Scroll도 스크롤이 가능한 엘리먼트에 사용하면 스크롤 했을때 Event를 바로바로 받아 볼 수 있다.

Thouch 들은 마우스 뿐만 아니라 모바일에서도 옆으로 넘기거나 꾹 누르는 효과등을 처리해 줄 수 있다.

## 4. 레이아웃 빌더

https://quasar.dev/layout-builder

Layout Builder | Quasar Framework
Tool to build Quasar layouts. Configure the layout parts then export the code.
quasar.dev

따로 레이아웃 빌더도 지원하고 있다.
입맛에 맞춰서 메인 레이아웃을 만들어 사용할 수 있다.
Export Layout을 누르면 template 코드를 복사할 수 있는 화면이 나온다.

## 5. 커뮤니티

Vue를 하다보면 질문 사항이 생겨도 검색해 봤을 때 잘 안 나오거나 어떻게 검색해야 할지 모를 때가 있을 수 있다.
Quasar는 디스코드 커뮤니티를 운영하고 있는데 한국어 채널이 있긴 하지만 한국어 채널에서 활동하는 사람은 잘 없다.
영어로 질문글 올리면 Quasar 개발자들이나 유저들이 반나절 내외로 답변해준다.
뭐 안되는거 있다고 올리면 codeSandBox 링크 주면서 이런 식으로 수정해라 하고 답변해줄 때도 있다.

https://discord.com/invite/5TDhbDg

## 6. Quasar 1년 써본 후기

cli 지원 해주는게 엄청 편했다. Vue 깡통 프로젝트 생성해서 모듈을 하나하나 직접 집어넣는 거도 한 번쯤은 해보는 게 좋겠지만 귀찮으니 다 해주는 게 편하다.
Vite 유행하니 babel 대신에 Vite로 빌드할 수 있게 해주기도 하고 초기 세팅을 대신 해주는게 가장 큰 장점인 거 같다.
디자인도 Material Design을 따라가기 때문에 호불호도 적다.

Vue를 아예 처음하는 사람이라면 추천한다.
물론 처음부터 한번 싹 세팅해보는 게 좋지만 그럴 시간이 없을 때 쓰기 좋은 거 같다.
다른 프래임워크는 컴포넌트 하나하나에 중심을 줬다면 Quasar는 전체적인 소스를 줘버리기 때문에 그대로 복사해서 붙여 넣으면 크게 어려운 게 없는 거 같다.
