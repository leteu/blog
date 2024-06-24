---
{
  title: '[Vue 3] 라우트 변경, 새로고침, 창 닫기 감지',
  subtitle: '',
  timestamp: 1645084587,
  outline: 'deep',
  tags: ['vue3', '라우트 변경 감지', '새로고침 감지', '창 닫기 감지'],
  mainImg: '/images/vue-route-observe.png',
}
---

웹 소캣 이용해서 채팅 서비스 만들다가 새로고침으로 방 나가는 방법 예외 추가하려고 했다.  
당최 깔끔하게 해결법이 안나오다가 해결해서 글 적어본다.

::: tip
이 페이지에 도달한게 **새로고침**인지 **뒤로가기**인지 **링크 클릭**해서 왔는지 궁금할땐

> [[JS] 네비게이션 타이밍 가져오기 (새로고침, 뒤로가기, 네비게이트)](/posts/js-navigation-timing.md)

:::

## 1. Watch

그냥 주소만 바꿔서 나가는 경우일 때 사용할 수 있다.  
사용하긴 제일 쉽지만 별로 맘에 드는 방법은 아니다.  
새로고침 시엔 라우터가 변경되는 게 아니라 확인이 불가해서 동작하지 않는다.

::: code-group

```vue [Composition API]
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route,
  (to, from) => {
    /* 라우트 변경 감지시 여기가 실행됨 */
  },
  {
    deep: true,
  },
)
</script>
```

```vue [Optional API]
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data(){
    return { ... }
  },
  ...

  watch: {
    '$route': function(to, from) {
      // 라우트 변경이 감지되면 여기 실행됨
    }
  },

  ...
})
</script>
```

:::

- setup에서 route 쓰려면 위 코드처럼 useRoute 불러와서 써주면 된다. ( router는 useRouter )

## 2. BeforeRouteLeave

라우트 컴포넌트의 내부 가드이다. ( 어려운 말로 썼지만 그냥 vue-router 쓴 컴포넌트이다 )

BeforeRouteLeave 가드를 사용하면 장점이 어떠한 처리를 한 후에 next함수를 통해 라우트를 이동시켜 버릴 수 있다.  
사용자가 가려고 하는 라우트에 권한을 체크해서 `next()`를 하는 식으로 사용하면 좋다.  
단점으론 새로고침을 할 경우엔 라우터가 변경되지 않기 때문에 체크하지 못하고 창을 닫는 경우에도 마찬가지이다.

```vue
<script>
...
beforeRouteLeave(to, from, next) {
  // to 어디로 가려고 하고
  // from 어디에서 왔고
  // 처리 다 끝나고 next(); 로 이동 가능하다.
}
...
</script>
```

next 함수는 아규먼트로 아래 예제처럼 사용 가능하다.

```ts
next('/') // '/' 주소로 이동한다.
next(from.path) // 왔던 주소로 돌아간다.
```

## 3. beforeunload Event

사이트를 나가려고 할 때 정말 나가시겠습니까? 하고 뜨는 알림 창이다.  
창 닫기를 할 경우나 새로고침을 할 경우 경고를 띄워줄 수 있다.  
비동기 처리가 끝나고 창이 닫히게는 안 되는 거 같지만 창을 닫기 직전에 임시저장 처리 등을 해줄 수 있다.

```js
function leave(event) {
  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => {
  window.addEventListener('beforeunload', leave)
})

onBeforeUnMount(() => {
  window.removeEventListener('beforeunload', leave)
})
```

이렇게만 하면 알림 창이 나오긴 나온다.

![before unload alert](/images/beforeunload-alert.png)

문제는 나가기 버튼을 누른 후에 뭔갈 할 수가 없다.  
api를 쏴보려고 해도 빛에 속도로 나가 지더라...
