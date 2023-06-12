<template>
    <Carousel v-bind="settings" :breakpoints="breakpoints">
        <Slide v-for="category in categorys" :key="category">
            <div
                role="button"
                class="carousel__item rounded-3"
                @click="changeCategory(category)"
                :class="{ active_link: category === categoryActive }">
                {{ category }}
            </div>
        </Slide>

        <template #addons>
            <Navigation />
        </template>
    </Carousel>
</template>

<script>
import { defineComponent } from 'vue';
import { Carousel, Navigation, Slide } from 'vue3-carousel';

import 'vue3-carousel/dist/carousel.css';

export default defineComponent({
    name: 'Breakpoints',
    components: {
        Carousel,
        Slide,
        Navigation,
    },
    props: ['modelValue'],
    emits: ['update:modelValue'],
    data() {
        return {
            categoryActive: 'All',
            categorys: [
                'All',
                'Cars and vehicles',
                'Comedy',
                'Education',
                'Film and animation',
                'Gaming',
                'How-to and style',
                'Music',
                'News and politics',
                'Non-profits and activism',
                'People and blogs',
                'Pets and animals',
                'Science and technology',
                'Sport',
                'Travel and events',
            ],
            // carousel settings
            settings: {
                itemsToShow: 7.5,
                snapAlign: 'start',
            },
            // breakpoints are mobile first
            // any settings not specified will fallback to the carousel settings
            breakpoints: {
                // 300px and up
                300: {
                    itemsToShow: 2.2,
                    snapAlign: 'start',
                },
                // 700px and up
                700: {
                    itemsToShow: 3,
                    snapAlign: 'start',
                },
                // 1024 and up
                1024: {
                    itemsToShow: 8.2,
                    snapAlign: 'start',
                },
            },
        };
    },
    methods: {
        changeCategory(category) {
            this.categoryActive = category;
            this.$emit('update:modelValue', this.categoryActive);
        },
    },
});
</script>
<style>
.active_link {
    background-color: var(--btn) !important;
}
.carousel__track {
    padding: 0 2rem !important;
}
.carousel__item {
    margin: 0;
    padding: 0.3rem 0.6rem;
    background-color: var(--btn_hover);
}
.carousel__item:hover {
    background-color: var(--btn) !important;
}
.carousel__prev,
.carousel__next {
    background-color: #fff7;
    border-radius: 50%;
    /* padding: 1rem; */
    transform: translateY(-80%);
}
.carousel__prev:hover,
.carousel__next:hover {
    background-color: blueviolet;
}
.carousel__slide {
    width: auto !important;
    margin: 0 1rem;
}
</style>
