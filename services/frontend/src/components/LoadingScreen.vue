<template>
    <div class="screen">
        <div class="loading">
            <img class="spinner" src="../assets/spinner.svg" />
            <h1>Loading...</h1>
        </div>
    </div>
</template>

<style scoped>
.screen {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
}

.spinner {
    width: 120px;
    height: 120px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>