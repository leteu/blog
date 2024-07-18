---
{
  title: '[JS] ES6 백틱 ( ` )',
  subtitle: '자바스크립트에서 깔끔하게 문자 사이에 변수 추가하기',
  timestamp: 1643161609,
  outline: 'deep',
  tags: ['javascript', 'template literals', 'backtick', 'grave', '템플릿 리터널', '백틱'],
  layout: 'doc',
  mainImg: '/images/js-template-literal.webp',
}
---

## 1. 탬플릿 리터널

ES6부터 도입된 문자열이다.  
백틱 ( \` )을 사용한다.

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals
<UrlEmbed url="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals" />

위 문서를 기반으로 포스팅한 글이다.  
블로그만 보지 말고 공식 문서도 한번 읽어보면 좋겠다.

## 2. 줄 바꿈

기존 문자열은 \n과 같은 거로 줄 바꿈 해야 했지만 이젠 그냥 엔터 치고 줄 바꿈 하면 그대로 들어간다.

기존

```js
const temp = '줄바꿈\n줄바꿈'
```

백틱 사용

```js
const temp = `줄바꿈
줄바꿈`
```

## 3. 변수 사용

기존엔 문자열 따옴표 사이사이마다 변수와 플러스(+)의 향연이었지만 이젠 더 이쁘게 사용할 수 있다.  
이전엔 띄어쓰기 같은 경우에도 문자열에 넣어주고 더해줬지만 이젠 사이사이마다 ${}로 변수를 넣어줄 수 있다.

기존

```js
const age = 21
const gender = '남'
const nickname = 'leteu'
const temp = '별명: ' + nickname + ' / 나이: ' + age + ' / 성별: ' + gender
```

백틱 사용

```js
const age = 21
const gender = '남'
const nickname = 'leteu'
const temp = `별명: ${nickname} / 나이: ${age} / 성별: ${gender}`
```

## 4. Dom 생성시

자바스크립트에서 Dom Element를 생성시 html 문자열을 짜야하는 상황이 있을 수 있다.  
그때도 유용하게 쓸 수 있다.

```html
<!-- index.html -->

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="X-UA-Compatible"
      content="IE=edge"
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
  </head>
  <body>
    <div id="box"></div>
    <script src="index.js"></script>
  </body>
</html>
```

기존

```js
/* index.js */

let temp = ''
temp += '<h3>박스</h3>'
temp += '<div>'
temp += '<span>텍스트</span>'
temp += '</div>'

document.getElementById('box').appendChild(temp)
```

백틱 사용

```js
/* index.js */

const temp = `
  <h3>박스</h3>
  <div>
    <span>텍스트</span>
  </div>
`
document.getElementById('box').appendChild(temp)
```
