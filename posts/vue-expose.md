---
{
  title: '[Vuejs] Expose로 ref에서 함수 꺼내 쓰기',
  subtitle: 'Vue3에서 부모 컴포넌트에서 자식 컴포넌트의 함수 호출하기',
  timestamp: 1700811120,
  outline: 'deep',
  tags: ['Vue3', 'Expose'],
  mainImg: '/images/Vue.jpg',
}
---

사실 expose 하는 방법에 대한 글이라기 보단  
typescript로 작성할 때 자동완성 때문에  글 쓰게 됨  
난 vscode 쓰기 때문에 jetbrains에서는 원래 잘 나오고 있는지는 모른다.  
그래도 그냥 이렇게 명시적으로 해주는게 맞는거 같아 보인다.

## 1. 하는 방법

아래 코드 처럼 `expose`에 함수를 넣어주기만 하면 된다.
그럼 사용은 가능하다.  
(`typescript`에서는 조금 더 해줘야 한다.)

::: code-group

```vue [Composition API]
...
<script setup lang="ts">
import { ..., defineExpose } from 'vue'
...

function something() {
  console.log('to do')
}

defineExpose({ something })
</script>
...
```

```vue [Optional API]
<script>
defineComponent({
  method: {
    ...
    somthing: function () {
      console.log('to do')
    },
    ...
  },
  ...
  expose: ['something'],
  ...
})
</script>
```

:::

## 2. 사용법

위에서 작성한 Component를 `Child` 컴포넌트라고 하고 시작하겠다.

::: code-group

```vue [부모 컴포넌트]
<template>
  <Child @click="onClick" />
</template>

<script setup lang="ts">
import Child from 'src/components/path/to/ChildComponent.vue'

const ChildRef = ref<typeof Child>()

function onClick() {
  ChildRef.value?.something()
  // 이러면 console에 `to do`라고 나올 거임
}
</script>
```

:::

이렇게 작성하면 실행은 될거다.

그런데 문제가 생겼다. 아주 `빅 이슈`다.

something이라는 method가 자동완성도 안되고 마우스를 얹어봐도 `any`라고만 나온다.  
`lint`가 함수가 존재하는지 여부도 몰라서 ? 붙이라고 뭐라고 한다.  
내가 기대한 건`() => void`인데...  
멋이 없다.. 팀원들도 내가 만든 컴포넌트를 사용하면서 expose된 함수가 뭔지 모를거다...

## 3. 멋 생성

애초에 import 저렇게 해오는 거부터 멋이 없다. 저거 먼저 해결해 보자.  
컴포넌트를 그냥 냅다 파일 경로로 들고오지 말고 깔끔하게 좀 쓰자.

::: code-group

```ts [src/components/path/to/index.ts]
export { default as Child } from './ChildComponent.vue'
```

:::

이렇게 Child 컴포넌트가 있는 폴더에 `index.ts` 하나 만들어서 export 해주자.

```vue
...
<script setup lang="ts">
import { Child } from 'src/components/path/to'

...
</script>
...
```

이런 느낌으로 `import` 해 올 수 있다. 벌써 멋있다.
하지만 이 글을 작성하게 된 이유인 내가 만든 멋있는 함수의 타입이 `any`라고 나오는 문제가 남아있다.
위 코드처럼 작성해도 여전히 타입을 찾지 못한다.

index.ts를 이렇게 수정해 주자

::: code-group

```ts [src/components/path/to/index.ts]
import { default as Child } from './ChildComponent.vue'

type Child = InstaceType<typeof Child>

export { Child }
```

:::

이제 Child 컴포넌트를 사용하는 부모 vue 파일에서도 코드를 약간 수정해 준다.  
(typeof 라고 작성해준거 제거)

::: code-group

```vue [부모 컴포넌트]
<template>
  <Child @click="onClick" />
</template>

<script setup lang="ts">
import Child from 'src/components/path/to/ChildComponent.vue'

const ChildRef = ref<typeof Child>()  // [!code --]
const ChildRef = ref<Child>()  // [!code ++]

...
</script>
```

:::

이제 자동 완성도 잘 되고 타입 툴팁도 잘 뜨고 멋있다.
위에 index.ts에서 Child컴포넌트의 alias로 타입을 알려주었기 때문에 가능하다.

항상 멋있게 코드를 작성하자
