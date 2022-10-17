<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header bg-dark">
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="text-light float-start">{{title}}</h5>
                        </div>
                        <div class="col-md-6">
                            <button @click="createTask" class="btn btn-success btn-sm float-end">New Task</button>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Date & Time</th>
                                    <th>Detail</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(task, index) in tasks" :key="index">
                                    <td>{{index + 1}}</td>
                                    <td>{{task.title}}</td>
                                    <td>{{task.date}} | {{task.time}}</td>
                                    <td>
                                        {{task.detail.length <= 10 ? task.detail : task.detail.substr(0, 10) + '...'}}
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="taskModalLabel">Create new Task</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="title">Заголовок</label>
                                <input type="text" class="form-control" v-model="taskData.title">
                                <span class="text-danger" v-show="taskErrors.title">Заголовок обязателен</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="date">Дата</label>
                                <input type="date" class="form-control" v-model="taskData.date">
                                <span class="text-danger" v-show="taskErrors.date">Дата обязательна</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="time">Время</label>
                                <input type="time" class="form-control" v-model="taskData.time">
                                <span class="text-danger" v-show="taskErrors.time">Время обязательно</span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="detail">Описание</label>
                                <textarea class="form-control" rows="3" v-model="taskData.detail"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" @click="storeTask()" class="btn btn-primary">Create Task</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup: () => ({
        title: "All tasks"
    }),
    data() {
        return {
            taskData: {
                title: '',
                date: '',
                time: '',
                detail: '',
            },
            taskErrors: {
                title: false,
                date: false,
                time: false,
            },
            tasks: {},
        }
    },
    mounted() {
        this.getTasks()
    },
    methods: {
        getTasks() {
            axios.get('api/getTasks').then(response => {
                this.tasks = response.data
            }).catch(errors => {
                console.log(errors)
            })
        },
        createTask() {
            this.taskData = {
                title: '',
                date: '',
                time: '',
                detail: '',
            }
            this.taskErrors = {
                title: false,
                date: false,
                time: false,
            }
            $('#taskModal').modal('show')
        },
        storeTask() {
            this.taskData.title == '' ? this.taskErrors.title = true : this.taskErrors.title = false
            this.taskData.date == '' ? this.taskErrors.date = true : this.taskErrors.date = false
            this.taskData.time == '' ? this.taskErrors.time = true : this.taskErrors.time = false

            if (this.taskData.title && this.taskData.date && this.taskData.time) {
                axios.post('api/storeTask', this.taskData).then(response => {
                    console.log(response.data)
                }).catch(errors => {
                    console.log(errors)
                }).finally( () => {
                    $('#taskModal').modal('hide')
                });
            }
        },
    }
}
</script>

<style scoped>

</style>
