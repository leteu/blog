---
{
  title: '[JS] 네비게이션 타이밍 가져오기 (새로고침, 뒤로가기, 네비게이트)',
  subtitle: '',
  timestamp: 1697169429,
  outline: 'deep',
  tags:
    [
      '새로고침 감지',
      '뒤로가기 감지',
      '크롤링 감지',
      '네비게이션 타이밍',
      'getEntriesByType',
      'PerformanceNavigationTiming',
    ],
  mainImg: '/images/js-navigation-timing.webp',
}
---

페이지 새로고침을 통해 화면에 왔을 경우 뭔가 처리를 하고 싶었는데  
죄다 beforeunload만 알려주길래 그냥 MDN 뒤져서 찾았다.  
메모 및 다른 사람들은 이런 삽질은 안했으면 좋겠어서 작성해둔다.

## 1. PerformanceNavigationTiming

이거 쓰면 다 해결됨

```js
window.performance.getEntriesByType('navigation')
```

## 2. 사용법

우리는 바로 전 화면의 타입을 봐야하니 위 코드에서 이렇게 `type`만 가져온다.

```js
window.performance.getEntriesByType('navigation')?.[0]?.type
```

### 2-1. navigate

a태그나 location.href로 넘어왔거나 아래 3개의 경우가 아니면 이거다.

### 2-2. reload

내가 원하던거다. 새로고침으로 페이지에 들어왔을때 이거로 나온다.

### 2-3. back_forward

뒤로가기로 페이지에 오면 이거로 나온다.

### 2-4. prerender

다음 라우팅을 위해 페이지 리소스가 필요할 수 있다는 힌트를 브라우저에게 전달해서 가져올때는 `navigate`가 아니라 `prerender`라고 나온다. 사전 렌더링 때는 이거로 나온다는 뜻이다.
