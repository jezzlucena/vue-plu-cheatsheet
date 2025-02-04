<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  variety?: Variety,
  onSubmit: (variety: Variety) => void,
  onDelete: (variety: Variety) => void,
  onClose: () => void,
}>();

const rawVariety = toRaw(props.variety);

const commodity = ref(rawVariety?.commodity || "");
const varietyName = ref(rawVariety?.variety || "");
const plu = ref(rawVariety?.plu || "");
const size = ref(rawVariety?.size || "");
const aka = ref(rawVariety?.aka || "");

function handleSubmit() {
  if (!commodity.value || !varietyName.value || !/^\d{1,5}$/.test(plu.value)) {
    toast.error("Please fix required fields.", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 2000 })
    return;
  }

  props.onSubmit({
    _id: rawVariety?._id || "undefined",
    commodity: commodity.value,
    variety: varietyName.value,
    plu: plu.value,
    size: size.value || "",
    aka: aka.value || ""
  });
}

function handleDelete() {
  props.onDelete({
    _id: rawVariety?._id || "undefined",
    commodity: commodity.value || "",
    variety: varietyName.value || "",
    plu: plu.value || "",
    size: size.value || "",
    aka: aka.value || ""
  });
}
</script>

<template>
  <div class="modal">
    <div class="modal-bg" @click="onClose"></div>
    <hr/>
    <div class="modal-content">
      <h3>
        <span v-if="variety">Edit Variety</span>
        <span v-else>New Variety</span>
      </h3>
      <hr/>
      <span class="close" @click="onClose">&times;</span>
      <form @submit.prevent="handleSubmit">
        <div class="row">
        <div class="column">
          <label class="label required">Commodity</label>
          <input :class="{ required: true, valid: commodity !== '' }" type="text" name="commodity" v-model="commodity" placeholder="E.g. Apple">
        </div>
        <div class="column">
          <span class="label required">Variety</span>
          <input :class="{ required: true, valid: varietyName !== '' }" type="text" name="variety" v-model="varietyName" placeholder="E.g. Fuji">
        </div>
      </div>
      <div class="row">
        <div class="column">
          <label class="label required">PLU</label>
          <input :class="{ required: true, valid: /^\d{1,5}$/.test(plu) }" type="text" pattern="^\d{1,5}$" name="plu" v-model="plu" placeholder="E.g. 4131">
        </div>
        <div class="column">
          <label class="label">Size</label>
          <input type="text" name="size" v-model="size" placeholder="E.g. All Sizes">
        </div>
      </div>
      <div class="column">
        <label class="label">Aka</label>
        <input type="textarea" name="aka" v-model="aka" rows="2" placeholder="Also Known As...">
      </div>
      <div class="flex">
        <div class="spacer"></div>
        <button class="submit" type="submit">Save</button>
        <button class="cancel" @click.prevent="onClose">Cancel</button>
        <button v-if="rawVariety" class="delete" @click.prevent="handleDelete">Delete</button>
      </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
}

.modal-bg {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
}

.modal-content {
  background-color: white;
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
}

.close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  display: block;
  text-align: right;
  font-size: 18px;
  cursor: pointer;
}

hr {
  margin: 0.5rem 0;
}

.row {
  display: flex;
  justify-content: space-between;
  
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}

.column {
  position: relative;
  flex: 1;

  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}

.label {
  position: absolute;
  top: 0px;
  left: 4px;
  background-color: rgba(255, 255, 255, 0.9);
  line-height: 8px;
  padding: 0 2px;
  font-size: 10px;

  &.required::after {
    content: ' *';
    color: red;
  }
}

input {
  padding: 10px;
  border-radius: 0.5rem;
  margin: 0.2rem 0;
  border: 1px solid #ccc;

  &[type="textarea"] {
    width: 100%;
  }

  &.required:not(.valid) {
    border-color: red;
  }
}

.flex {
  display: flex;

  .spacer {
    flex: 1;
  }
}

button {
  padding: 10px;
  border-radius: 0.5rem;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  margin-left: 0.4rem;
  font-weight: bold;

  &.submit {
    background-color: #007bff;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.cancel {
    background-color: white;
    border: 0.5px solid black;
    color: black;

    &:hover {
      background-color: #ccc;
    }
  }

  &.delete {
    background-color: #ff0000;

    &:hover {
      background-color: #aa0000;
    }
  }
}
</style>