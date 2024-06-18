---
{
  title: '[JS] 배열 활용 map, filter, reduce, forEach, find 메소드',
  subtitle: '',
  timestamp: 1677932520,
  outline: 'deep',
  tags: ['js array', 'map', 'foreach', 'reduce'],
  layout: 'doc',
  mainImg: '/images/javascript.png',
}
---

자바스크립트를 하다 보면 엄청 자주 쓰게 되는 배열 조작 메소드들을 소개해보려고 한다.
알아두면 두고두고 쓸 일이 많다.
아래 링크에서 더 자세하고 많이 볼 수 있다.

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array

- 아래 나오는 친구들 모두 원래의 배열은 변형하지 않는다.

## 1. Map

```js
arr.map(callback(currentValue[, index[, array]])[, thisArg])
```

공식 문서에는 이렇게 설명하고 있다.  
저거보고 이해하는 사람은 이 글 안 보고 나가도 될 거 같다.

Map 메소드는 배열은 반복하여 현재 값, 현재 값의 인덱스, 돌고 있는 배열을 콜백으로 돌려준다.  
그리고 콜백의 리턴된 값으로 새 배열을 만들어준다.

```js
const temp = [
  { id: 1, name: '홍길동', age: 20 },
  { id: 2, name: '고길동', age: 30 },
  { id: 3, name: '둘리', age: 10 },
  { id: 4, name: '햄토리', age: 40 },
  { id: 5, name: '루피', age: 50 },
]

// 이렇게 작성하거나
const newArr = temp.map((item, index) => {
  return item.id
})

// 화살표 함수니까 굳이 중괄호해서 return 하지 말고 이렇게도 가능하다.
const newArr = temp.map((item, index) => item.id)

console.log(newArr) // [1,2,3,4,5]
```

temp는 변경되지 않는다.

## 2. Filter

```js
arr.filter(callback(element[, index[, array]])[, thisArg])
```

filter도 크게 다르지 않다.  
똑같이 현재 값, 현재 값의 인덱스, 돌고 있는 배열을 콜백으로 돌려준다.  
콜백의 리턴 값이 true인 것만 모아서 배열로 만들어준다.

```js
const temp = [
  { id: 1, name: '홍길동', age: 20 },
  { id: 2, name: '고길동', age: 30 },
  { id: 3, name: '둘리', age: 10 },
  { id: 4, name: '햄토리', age: 40 },
  { id: 5, name: '루피', age: 50 },
]
const newArr = temp.filter((item, index) => {
  // item의 age가 20보다 작거나 같으면 true 리턴
  return item.age <= 20
})

console.log(newArr) // [{ id: 1, name: '홍길동', age: 20 }, { id: 3, name: '둘리', age: 10 }]
```

## 3. Reduce

```js
arr.reduce(callback[, initialValue])
```

얘는 공식 문서를 보면 솔직히 좀 특이하게 생기긴 했다.

누산기, 현재 값, 현재 값의 인덱스, 돌고 있는 배열을 콜백으로 돌려준다.
보통 숫자 배열 전부 더할 때 나배 열에 중복 값을 제거하여 사용할 때 쓸 수 있다.

```js
const temp1 = [1, 2, 3, 4, 5]
const temp2 = [
  { id: 1, name: '홍길동', age: 20, type: 'history' },
  { id: 2, name: '고길동', age: 30, type: 'babyDooly' },
  { id: 3, name: '둘리', age: 10, type: 'babyDooly' },
  { id: 4, name: '햄토리', age: 40, type: 'hemtaro' },
  { id: 5, name: '루피', age: 50, type: 'onepiece' },
]
const newArr1 = temp1.reduce((acc, cur) => acc + cur)
const newArr2 = temp1.reduce((acc, cur) => acc + cur, 10) //초기값을 지정해줄 수도 있다.
const newArr3 = temp.reduce((acc, current, index) => {
  if (acc.findIndex((type) => type === current.type) === -1) {
    // acc안에 같은 값이 없을때만 acc에 추가
    acc.push(current.type)
  }

  return acc // 꼭 acc를 리턴 해줘야한다. 리턴 된 결과가 다음에 acc에 들어가서 사용됨.
}, [])

console.log(newArr1) // 15;
console.log(newArr2) // 25;
console.log(newArr3) // ['history', 'babyDooly', 'hemtaro', 'onepiece'];
```

## 4. ForEach 

```js
arr.forEach(callback(currentvalue[, index[, array]])[, thisArg])
```

배열 안 만들어 주는 거 빼면 map이랑 같다.
forEach 메소드는 배열은 반복하여 현재 값, 현재 값의 인덱스, 돌고 있는 배열을 콜백으로 돌려준다.
for문 대신해서 멋있어 보이게 쓸 수 있을 거 같다.

```js
const temp = [
  { id: 1, name: '홍길동', age: 20 },
  { id: 2, name: '고길동', age: 30 },
  { id: 3, name: '둘리', age: 10 },
  { id: 4, name: '햄토리', age: 40 },
  { id: 5, name: '루피', age: 50 },
]
const newArr1 = []
const newArr2 = []

for (const i = 0; i < temp.length; i++) {
  newArr1.push(temp[i].id)
}

temp.forEach((item, index) => {
  newArr2.push(item.id)
})

console.log(newArr1) // [1,2,3,4,5]
console.log(newArr2) // [1,2,3,4,5]
```

## 5. find

```js
arr.find(callback[, thisArg])
```

find는 현재 값, 현재 값의 인덱스, 돌고 있는 배열을 콜백으로 돌려준다.
정말 고마운 친구다. 배열 안에서 조건에 맞는 첫 번째 요소를 리턴해준다.

```js 
const temp = [
  { id: 1, name: '홍길동', age: 20 },
  { id: 2, name: '고길동', age: 30 },
  { id: 3, name: '둘리', age: 10 },
  { id: 4, name: '햄토리', age: 40 },
  { id: 5, name: '루피', age: 50 },
]

const newElement = temp.find((item, index) => item.id === 2)

console.log(newElement) // { id: 2, name: '고길동', age: 30 }
```
