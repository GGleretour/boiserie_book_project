<template>
    <div id="cube_container">
        <img
        alt="cube"
        :src="cubeid.img_src"
        width="100"
        height="auto"
        
        
        />
    </div>
</template>


<script>
export default {
    var :c = document.querySelector(':cube_info'),
    props: {
        cubeid: {
            type: Object,
            required: true,
        }
    },
    methods: {
        close()
        {
            this.$emit('close-book');
        }
    },
    data()
    {

    },
    myFunction_set() {
        c.style.setProperty('--x_out', this.cubeid.x_out);
        c.style.setProperty('--y_out', this.cubeid.y_out);
    }
};
</script>

<style scoped>
:cube_info {
    --x_out: 0;
    --y_out: 0;
}
#cube_container {
    z-index: 3;
    display: block;
    position:absolute;
    left: var(--x_out);
    top: var(--y_out);
    transform: translate(-50%, -50%);
}
</style>