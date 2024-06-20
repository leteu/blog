---
{
  title: '[Vue 3] Props, Emit',
  subtitle: '',
  timestamp: 1647504296,
  outline: 'deep',
  tags: ['vue3', 'Prop', 'Emit'],
  mainImg: '/images/Vue.jpg',
}
---

## 1. 왜 쓰나

Vue를 사용하다 보면 상위 컴포넌트에서 하위 컴포넌트로 데이터를 넘겨주거나 반대로 하위에서 상위로 올려 받아야 하는 경우가 있을 수 있습니다.

## 2. 간단 요약

::: info Props

- 상위 컴포넌트에서 하위 컴포넌트로 뿌려주는 것
- 하위 컴포넌트에서 선언하고 상위에서 선언해둔 이름으로 보낼 수 있음.
  :::

::: info Emit

- 하위 컴포넌트에서 상위 컴포넌트로 올려주는 것
- 하위 컴포넌트에서 선언하고 상위에서 선언해둔 이름으로 받을 수 있음.
  :::

## 3. Props

예시)

```vue [부모 컴포넌트]
<ChildComponent :custom-prop="value" />
```

```vue [자식 컴포넌트 ChildComponent.vue]
<template>
  {{ customProp }}
</template>

<script>
...
props: {
	customProp: {
    type: String,
		default: () => '',
    required: false,
    validator: (val) => true,
  }
}
...
</script>
```

컴포넌트의 props에서 키을 지정한 뒤 부모 컴포넌트에서 키에 맞는 값을 보내주는 식으로 사용한다.  
props는 배열로 작성하여 키값을 텍스트만으로도 지정할 수 있다.

```js
props: ['key1', 'key2']
```

하지만 이렇게 작성할 경우 키에 대한 타입이 명확하지 않아 협업시 문제가 생길 수 있다.

typescript를 사용할 경우에는 Vue3 기준으로

```js
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    key1: {
      type: Array as PropType<타입>,
    }
  },
  ...
})
```

이런 식으로 PropType을 불러와 사용해주면 된다.

2023.02.24 추가) Composition API setup에서의 활용을 안적고 올렸길래 추가

```vue
<template>...</template>

<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  customProp: {
    type: String as PropType<'hihi'>,
    default: () => 'hihi',
    required: false,
    validator: (val) => val === 'hihi',
  },
})
</script>
```

## 4. Emit

Emit은 하위의 자식 컴포넌트에서 다시 상위인 부모 컴포넌트로 값을 보내줄 때 사용한다.

예시)

```vue
<!-- 부모 컴포넌트 -->
<template>
  <ChildComponent @update:text="(val) => (text = val)" />
</template>

<script>
...
data(){
	return {
    	text: '',
    }
}
</script>
```

```vue
<!-- 자식 컴포넌트-->
<script>
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  ...
  emit: [ 'update:text' ],
	created(){
    	this.$emit('update:text', '테스트 텍스트');
	},
  ...
})
</script>
```

```vue
<!-- 자식 컴포넌트-->
<script>
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  ...
  emit: [ 'update:text' ],
	setup(props, { emit }) {
    emit('update:text', '테스트 메시지');
  }
  ...
})
</script>
```

2023.02.24 추가) setup에서의 활용을 안적고 올렸길래 추가

```vue
<template>...</template>

<script lang="ts" setup>
import { PropType } from 'vue'

// 이렇게 하나
const emit = defineEmits(['update:text', 'update:src'])
// 이렇게 하나
const emit = defineEmits({
  'update:text': (txt: string) => txt,
  'update:src': (src: string) => src,
})
// 이렇게 하나 같음
const emit = defineEmits<{
  (e: 'update:text', txt: string): void
  (e: 'update:src', src: string): void
}>()

const emitText = () => {
  emit('update:text', 'text')
}

const emitSrc = () => {
  emit('update:src', 'src')
}
</script>
```

## 5. 번외 ( Vuex, Pinia )

만약 동일 선상에 컴포넌트끼리 data를 주고 받으려면 A 컴포넌트에서 상위 컴포넌트로 Emit 하고 상위 컴포넌트에서 B 컴포넌트로 prop으로 넘겨주고 이러한 번거로운 작업이 생겨 버립니다.

이를 해결해주는것이 Store이고 좀 더 편하게 사용할 수 있도록 만들어진 라이브러리가 Vuex, Pinia 등이 있습니다.

Vuex와 Pinia는 이번 포스팅에선 언급만 하고 넘어가고 후에 자세하게 풀어보도록 하겠습니다.

https://kr.vuejs.org/v2/guide/state-management.html
