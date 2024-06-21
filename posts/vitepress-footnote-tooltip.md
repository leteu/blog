---
{
  title: '[Vitepress] Vitepress footnote tooltip',
  subtitle: 'Vitepress 각주에 툴팁으로 미리보기 추가하기',
  timestamp: 1718956526,
  outline: 'deep',
  tags: ['vitepress', 'markdown-it', 'footnote', 'tooltip'],
  layout: 'doc',
  mainImg: '/images/vitepress-footnote-tooltip.png',
}
---

Vitepress에서 각주 기능을 넣고 확인해보니 tooltip처럼 뿅하고 나오는게 없길래 그냥 하나 만들었다.
이게 정답인지 아닌지는 모르겠지만 나는 마음에 든다.

[완성 코드 바로가기](#_3-완성된-코드)

## 1. markdown-it-footnote

우선 vitepress는 `markdown-it`를 통해 markdown을 html로 변환해주고 있다.  
그래서 각주를 달려고 하면 `markdown-it-footnote`이라는 확장 패키지를 통해 각주 기능을 추가 할 수 있다.

## 1-1. 설치

```bash
npm i -d markdown-it-footnote

# or

yarn add -D markdown-it-footnote

# or

pnpm i -D markdown-it-footnote

# or

bun add markdown-it-footnote -d
```

사용중인 패키지 매니저 사용해서 적절하게 설치해준다.

## 1-2. 적용 및 사용

`<vitepress root>/.vitepress/config.mts`에 가보면 vitepress의 기본적인 설정을 해줄수있다.

```ts
...
import footnote from 'markdown-it-footnote'
...
export default defineConfig({
  ...
  markdown: {
    config: (md) => {
      md.use(footnote)
    },
    ...
  },
  ...
})
```

이렇게 `markdown-it` 라이브러리에 `footnote` 기능을 사용하도록 해줄 수 있다.

```md
hello[^1]

[^1]: world
```

hello[^1]

이렇게 사용해 줄 수 있다.  
하지만 각주 하나 보겠다고 아래 내렸갔다가 위로 다시 올라갔다가 url에는 이상한 id값 계속 붙고...  
지저분하다.

## 2. 툴팁 제작

기본적으로 툴팁이 있어야 붙이든 말든 하기 때문에 codepen에서 적당히 이쁜 툴팁을 찾아왔다.  
맘에 안들면 다른거 찾아와서 똑같이 따라하면 된다.  
나는 아래 보이는 tooltip을 하려고 한다.

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS Tooltip Magic" src="https://codepen.io/tutsplus/embed/WROvdG?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/tutsplus/pen/WROvdG">
  CSS Tooltip Magic</a> by Envato Tuts+ (<a href="https://codepen.io/tutsplus">@tutsplus</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### 2-1. Tooltip Component

각주는 그대로 놔두고 뭔가 추가로 붙여주기만 하면 될거같아서 slot에는 각주를 넣고 그 각주에 tooltip만 붙여주면 될거같다.

::: code-group

```vue [FootnoteTooltip.vue]
<template>
  <slot></slot>
</template>

<script setup lang="ts">
const props = defineProps({
  footnote: {
    type: [Number, String],
    required: true,
  },
})
</script>

<style lang="scss"></style>
```

```ts [theme/index.ts]
...
export default {
  ...,
  enhanceApp({ app, router, siteData }) {
    ...
    app.component('FootnoteTooltip', FootnoteTooltip)
  },
  ...
} satisfies Theme
```

:::

FootnoteTooltip 컴포넌트를 만들어준 뒤 어디서든 사용하기 위해서 `.vitepress/theme/index.ts` 전역 컴포넌트로 지정해줬다.  
컴포넌트 이름이 너무 긴거 같으면 맘대로 바꿔넣어두면 된다.

`<style>` 태그에 `scope` 달아두면 컴포넌트 안에서만 쓸 수 있으니까 지워야한다.

`<template>` 부분은 각주를 그대로 받아서 사용할거라 default slot만 추가해서 마무리 한다.

`prop`으로는 굳이 각주를 다 안가지고 와도 문서 하단에 뿌려둘것이기 때문에 굳이 전문을 가지고 오지말고 각주 번호나 이름을 가져오면 될거같다.

### 2-2. 본문 각주 바로가기에 data-tooltip 추가

각주의 변환된 html 코드를 확인해 보니 아래와 같은 형태인것을 알 수 있다.

```html
<a
  href="#fn1"
  id="fnref1"
  >[1]</a
>

...

<li
  id="fn1"
  class="footnote-item"
>
  <p>
    world
    <a
      href="#fnref1"
      class="footnote-backref"
      >↩︎</a
    >
  </p>
</li>
```

본문에 써지는 `<a>`태그의 id는 `#fnref + footnote`  
하단에 써지는 `<li>`태그의 id는 `#fn + footnote`

와 같은 형태인 것을 확인 할 수 있었다.

그래서 li의 텍스트를 긁어와서 a에 `dataset.tooltip`으로 넣어주면 나중에 스타일 붙일때 사용할 수 있을거 같다.  
아래는 위에서 설명한 내용에 대한 코드다.

```vue
<script setup lang="ts">
import { nextTick, onMounted } from 'vue'

const props = defineProps({
  footnote: {
    type: [Number, String],
    required: true,
  },
})

onMounted(() => {
  nextTick(() => {
    // <li> 태그 들고오고
    const fn = document.getElementById(`fn${props.footnote}`)!

    // <a> 태그 들고와서
    const fnref = document.getElementById(`fnref${props.footnote}`)!

    // <li> 클론 하나 만들어 준 뒤
    const fnClone = fn.querySelector('p')?.cloneNode(true) as HTMLElement

    // 뒤에 붙는 화살표 지워주고
    fnClone.removeChild(fnClone.querySelector('a')!)

    // <a> 태그에 data-tooltip에 넣어준다.
    fnref.dataset.tooltip = fnClone.innerText
  })
})
</script>
```

### 2-3. 스타일 붙이기

코드펜에서 찾은 맘에 드는 툴팁을 아래 코드처럼 `[data-tooltip]`에 적절하게 적용시켜 준다.

```css
[data-tooltip] {
  /* 여기에 뭔가 하면 각주에 적용될거다 */
}
```

## 3. 완성된 코드

```md
hello<FootnoteTooltip footnote="2">[^2]</FootnoteTooltip>

[^2]: world
```

hello<FootnoteTooltip footnote="2">[^2]</FootnoteTooltip>

::: code-group

```vue [FootnoteTooltip.vue]
<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'

const props = defineProps({
  footnote: {
    type: [Number, String],
    required: true,
  },
})

onMounted(() => {
  nextTick(() => {
    const fn = document.getElementById(`fn${props.footnote}`)!
    const fnref = document.getElementById(`fnref${props.footnote}`)!

    const fnClone = fn.querySelector('p')?.cloneNode(true) as HTMLElement
    fnClone.removeChild(fnClone.querySelector('a')!)

    fnref.dataset.tooltip = fnClone.innerText
  })
})
</script>

<style lang="scss">
[data-tooltip] {
  position: relative; /* opinion 1 */

  &::before,
  &::after {
    text-transform: none; /* opinion 2 */
    font-size: 0.9em; /* opinion 3 */
    line-height: 1;
    user-select: none;
    pointer-events: none;
    position: absolute;
    display: none;
    opacity: 0;
  }

  &::before {
    content: '';
    border: 5px solid transparent; /* opinion 4 */
    z-index: 1001; /* absurdity 1 */
  }

  &::after {
    content: attr(data-tooltip); /* magic! */

    /* most of the rest of this is opinion */
    font-family: Helvetica, sans-serif;
    text-align: center;

    /*
      Let the content set the size of the tooltips
      but this will also keep them from being obnoxious
      */
    min-width: 3em;
    white-space: nowrap;
    padding: 1ch 1.5ch;
    border-radius: 0.3ch;
    box-shadow: 0 1em 2em -0.5em rgba(0, 0, 0, 0.35);
    background: #555;
    color: #fff;
    z-index: 1000; /* absurdity 2 */
  }

  &:hover::before,
  &:hover::after {
    display: block;
    animation: tooltips-vert 300ms ease-out forwards;
    left: 50%;
    transform: translate(-50%, -0.5em);
  }

  &::before {
    bottom: 100%;
    border-bottom-width: 0;
    border-top-color: #555;
  }

  &::after {
    bottom: calc(100% + 5px);
  }
}

/* don't show empty tooltips */
[data-tooltip='']::before,
[data-tooltip='']::after {
  display: none !important;
}

/* KEYFRAMES */
@keyframes tooltips-vert {
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes tooltips-horz {
  to {
    opacity: 1;
    transform: translate(0, -50%);
  }
}
</style>
```

:::

[^1]: world
[^2]: world
