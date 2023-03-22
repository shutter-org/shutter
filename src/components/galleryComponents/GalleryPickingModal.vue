<template>
    <div
        class="post flex flex-col gap-4 items-center rounded-lg p-4 relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4 z-50">

        <!-- User identifications -->
        <div class="flex flex-row items-center justify-between w-full">
        </div>

        <!-- Picture -->
        <div v-for="items in 5">
            <input type="checkbox" class="appearance-none indeterminate:bg-gray-300 ..." value="here">
            <label class="ml-2">Here</label>
        </div>
        <!-- Multiline text input (description, tags) -->
        <textarea class="inputable desc h-36 w-full text-xl p-2 border-2 rounded-lg" placeholder="Description..."
            maxlength="200" />
        <textarea class="inputable tags h-32 w-full text-xl p-2 border-2 rounded-lg" placeholder="Tags..."
            maxlength="160" />

        <!-- Save button -->
        <button class="saveButton text-xl p-2 rounded-lg pr-10 pl-10" @click="emit('save')">
            Save
        </button>
    </div>
</template>
<script setup lang="ts">


const emit = defineEmits({
    save: () => {
        return
    },
});


</script>
<style scoped>
.post {
    background: var(--modal-color);
}

.inputable {
    border-color: var(--color-border);
    background-color: var(--color-background);
}

.desc {
    box-shadow: none;
    resize: none;
}

.tags {
    box-shadow: none;
    resize: none;
    color: var(--special-text-color);
}

.saveButton {
    background-color: var(--hover-color);
}

.postButton:hover {
    background-color: var(--color-border);
}

.stack {
    grid-row: 1;
    grid-column: 1;
}

.inputableImage {
    color: rgba(255, 255, 255, 0.3);
}

.shadowback {
    background-color: rgba(0, 0, 0, 0.3);
}
</style>