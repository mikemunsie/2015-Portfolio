<template>
  <div class="postTemplate">
    <div class="hero">
      <div class="bg" style="background-image: url('/images/bg_3.jpg')"></div>
      <div class="overlay"></div>
      <div class="container">
        <div class="title">
          <h1>{{title}}</h1>
          <h2>{{date}}</h2>
          <a :href="fullLink">http://munstrocity.com/{{fullLink}}</a>
        </div>
      </div>
    </div>
    <slot name="default" />
  </div>
</template>

<script>
export default {
  props: [ "title", "date", "fullLink" ]
}
</script>