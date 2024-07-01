---
{
  title: '[Vuejs] Component 기초 - template, render, setup, slot',
  subtitle: 'Vue와 같은 dom을 조작하는 라이브러리에서 컴포넌트는 가장 기초가 되는 부분이다. 작은 컴포넌트 하나라도 제대로 만들어두자.',
  timestamp: 1677932220,
  outline: 'deep',
  tags: ['vue3', 'vue template', 'vue setup', 'vue slot'],
  mainImg: '/images/Vue.jpg',
}
---


컴포넌트는 Vue에서 가장 기초가 되는 부분이다.
컴포넌트 하나 잘 만들어두면 비슷한 화면은 계속 가져다 쓸 수 있다.
Vue 3를 기준으로 작성하였다.

## 1. 참고
 
https://kr.vuejs.org/v2/guide/components.html

일단 공식 문서를 보자. 답은 저기에 있다.   
저거 새창으로 열고 뒤로가기 눌러도 좋다.
 
## 2. 화면
 
일단 제일 중요한 건 화면이다.   
일단 뭐가 보여야 재밌으니 화면부터 들어가겠다.   
Template, Setup, Render 이렇게 3곳 중 한 군대를 골라서 화면을 만들어줄 수 있다.
 
### 2-1. template
 

제일 익숙한 html로 짤 수 있다.   
pug 언어로도 가능하다. ( 이 포스트에선 다루지 않는다 )

::: code-group

```vue [Composition API]
<template>
  <!-- 여기에 html 짜면 화면에 나온다 -->
  <div></div>
</template>

<script setup>

</script>
```

```vue [Optional API]
<template>
  <!-- 여기에 html 짜면 화면에 나온다 -->
  <div></div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({ 
  setup() {
    
  },
})
</script>
```

:::

딱 봐도 Optional API는 옛날 Vue2 시절을 못잊은 사람들을 위해 남겨둔거처럼 보인다.   
옛날에 data, create, method 넣던곳에 setup 하나만 넣고 끝낼 수 있다.   
어짜피 `composition api`랑 별반 차이 없으니 `render` 빼고는 `composition api` 기준으로만 작성하려고 한다.   
typescript, javascript 파일에서 컴포넌트 만들 사람들은 `optional api` 말고는 선택지가 없다.


### 2-2. render

vue3에서 vue2와 문법이 바뀐 녀석이다.   
바뀌어 봐야 `createElement`를 param으로 넘겨주던걸 h 함수를 import 해오는 식으로 밖에 변경된건 없다.   
[vue 2 render function](https://v2.vuejs.org/v2/guide/render-function)   

h 함수를 vue에서 임포트 해와서 코드를 짤 수 있다.   
쓸 때 template은 지우고 써야 한다. 걔가 우선순위가 더 높다.   

h 함수는 React의 `createElement`와 매우 유사하다.
~~라고 해봐야 react에서 `createElement` 써본 사람 몇 없다는건 말 안해줘도 알거 같다.~~

```vue
<script>
import { defineComponent, h } from 'vue'

export default defineComponent({
  setup() {	},
  render() {
    return h(
      'div',
      {
        // 어트리뷰트
      },
      () => [
        // 하위 컴포넌트
      ]
    )
  }
})
</script>
```

근데 우리는 vue3니까 

### 2-3. setup
 
여기서도 할 수는 있다. 근데 보통 여기서는 사용할 데이터를 선언해야 해서 잘 안 쓴다. 알아만 두자   
진짜로 쓰고 싶으면 template과 render는 지우고 사용해야한다.   
근데 웬만해선 여기선 render 하지 말고 template에서 하자   
문법은 render와 같이 h 함수를 임포트 해와서 쓴다.   

```vue
<script>
import { defineComponent, h } from 'vue'

export default defineComponent({
  setup() {
    return h(
      'div',
      {
        // 어트리뷰트
      },
      () => [
        // 하위 컴포넌트
      ]
    )
  }
})
</script>
```

setup에서는 기존 vue2에서 하던 `data`, `create`, `method`, ... 등의 라이프사이클과 state, method 등을 js, ts 파일에서 작성하듯이 작성할 수 있게 해준다.

::: code-group

```vue [Composition API]
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

// data에서 변수 선언 하던거 이런 느낌으로 바뀜
const temp = ref('')

onBeforeMount(() => {
  // create랑 똑같이 마운트 되기 전에 호출함.
})
</script>
```

```vue [Optional API]
<script>
import { defineComponent, ref, onBeforeMount } from 'vue'

export default defineComponent({
  setup() {
    // data에서 변수 선언 하던거 이런 느낌으로 바뀜
    const temp = ref('')

    onBeforeMount(() => {
      // create랑 똑같이 마운트 되기 전에 호출함.
    })

    return {
      temp,
    }
  }
})
</script>
```
:::

`Optional`과 `Composition` 둘다 setup이 있지만 `Composition`은 return 안해주고 선언만 해도 template에서 쓸 수 있다.   

더 뭐 보고 싶은게 있다면 공식 문서를 보거나 댓글로 질문 남겨주시면 답변 달아드립니다.

## 3. 컴포넌트 사용
 
컴포넌트를 만들어 놔도 불러오지 않으면 화면에 뿌릴 수 없다.   
전체적으로 사용하는 컴포넌트는 전역으로 처리하고 아닐 경우에 아래 코드처럼 하나하나 import 해와서 사용해주면 된다.

```vue
<template>
  <ChildComponenet />
</template>
```

::: code-group

```vue [Composition API]
<script setup lang="ts">
import { defineComponent } from 'vue'
import ChildrenComponent from './ChildrenComponent.vue';
</script>
```

```vue [Optional API]
<script>
import { defineComponent } from 'vue'
import ChildrenComponent from './ChildrenComponent.vue';

export default defineComponent({
  component: {
    ComponenetVue
  },
  setup() {},
})
</script>
```

:::

## 4. Slot

https://vuejs.org/guide/components/slots.html

prop으로 냅다 모든걸 보내버릴 생각 말고 `slot`도 활용을 해주자.

::: code-group

```vue [Component.vue]
<template>
  <div>
    <slot>
      <!-- default -->
    </slot>
  	<slot name="content">
      <!-- custom name -->
    </slot>
  </div>
</template>
```

:::

::: code-group

```vue [shorthand]
<template>
  <ComponentVue>
    <!-- 여기에 적으면 컴포넌트 안에 default slot에 적힌다 -->

    <template #content>
      <!-- 여기에 적으면 컴포넌트 안에 content slot에 적힌다 -->
    </template>
  </ComponentVue>
</template>
```

```vue [full]
<template>
  <ComponentVue>
    <!-- 여기에 적으면 컴포넌트 안에 default slot에 적힌다 -->

    <template v-slot:content>
      <!-- 여기에 적으면 컴포넌트 안에 content slot에 적힌다 -->
    </template>
  </ComponentVue>
</template>
```

:::

이렇게 컴포넌트 안에 원하는 위치에 따로 커스텀이 가능하다.   
컴포넌트의 재사용을 늘릴 수 있다.

`h 함수` 쓸 때도 slot 사용이 가능하다.

children을 쓰는 곳에 그냥 h 함수나 h 함수의 배열을 쓰면 기본적으로 default 슬롯에 들어가게 된다.   
따로 슬롯을 명시하여 사용하면 RawChildren 인터페이스가 아닌 RawSlots 인터페이스로 잡히게 된다.   

```js
h(
  ComponentVue,
  {
    // 어트리뷰트
  },
  {
    default: () => [
      h( ... ),
    ],
    content: () => [
      h( ... ),
      h( ... ),
    ]
  }
)
```

슬롯명: () => h( ... ) 형태로 사용하면 vue JSX에서도 슬롯이 사용 가능하다.


***

::: tip

**Prop**, **Emit** 사용법은 여기로

> [[Vue 3] Props, Emit](/posts/vue-prop-emit.md)

:::

::: tip

**Expose** 사용법은 여기로

> [[Vuejs] Expose로 ref에서 함수 꺼내 쓰기](/posts/vue-expose.md)

:::
