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
                                    <th>Sub Task Count</th>
                                    <th>Sub Tasks</th>
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
                                    <td>
                                        <span :class="`badge ${task.sub_tasks.length == 0 ? 'bg-warning' : 'bg-success'} text-dark`">
                                            {{task.sub_tasks.length}} Sub Tasks
                                        </span>
                                    </td>
                                    <td>
                                        <button @click="showSubTasks(task)" class="btn btn-info btn-sm">Sub Tasks</button>
                                    </td>
                                    <td>
                                        <button @click="editTask(task)" class="btn btn-primary btn-sm mx-1">Edit</button>
                                        <button @click="removeTask(task)" class="btn btn-danger btn-sm mx-1">Delete</button>
                                    </td>
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
        <div :class="`modal-dialog modal-dialog-centered ${!deleteMode ? 'modal-lg' : 'modal-sm'}`">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fs-5" id="taskModalLabel" v-show="!deleteMode">{{!editMode ? 'Create new Task' : 'Update Task'}}</h5>
                    <h5 class="modal-title fs-5" id="taskModalLabel" v-show="deleteMode">Delete Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row" v-show="!deleteMode">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="title">??????????????????</label>
                                <input type="text" class="form-control" v-model="taskData.title">
                                <span class="text-danger" v-show="taskErrors.title">?????????????????? ????????????????????</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="date">????????</label>
                                <input type="date" class="form-control" v-model="taskData.date">
                                <span class="text-danger" v-show="taskErrors.date">???????? ??????????????????????</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="time">??????????</label>
                                <input type="time" class="form-control" v-model="taskData.time">
                                <span class="text-danger" v-show="taskErrors.time">?????????? ??????????????????????</span>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-show="!deleteMode">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="detail">????????????????</label>
                                <textarea class="form-control" rows="3" v-model="taskData.detail"></textarea>
                            </div>
                        </div>
                    </div>

                    <h5 class="text-center" v-show="deleteMode">Are you sure you want to delete this task?</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" @click="!editMode ? storeTask() : updateTask()" class="btn btn-primary" v-show="!deleteMode">{{!editMode ? 'Create Task' : 'Save changes'}}</button>
                    <button type="button" @click="deleteTask()" class="btn btn-danger" v-show="deleteMode">Delete Task</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Sub Task Modal -->
    <div class="modal fade" id="subTaskModal" tabindex="-1" aria-labelledby="subTaskModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fs-5" id="subTaskModalLabel">Sub Tasks</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Detail</th>
                                    <th>Status</th>
                                    <th>Start Data</th>
                                    <th>End Data</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(sub_task, index) in sub_tasks" :key="index">
                                    <td>{{index + 1}}</td>
                                    <td>{{sub_task.title}}</td>
                                    <td>{{sub_task.detail}}</td>
                                    <td>
                                        <span :class="`badge ${sub_task.status == 0 ? 'bg-danger' : 'bg-success'}`">
                                            {{sub_task.status == 0 ? 'Incomplete' : 'Completed'}}
                                        </span>
                                    </td>
                                    <td>{{sub_task.start_date}}</td>
                                    <td>{{sub_task.end_date}}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm mx-1" @click="editSubTask(sub_task)">
                                            Edit
                                        </button>
                                        <button class="btn btn-danger btn-sm mx-1" v-if="!subEditMode" @click="deleteSubTask(sub_task)">
                                            Delete
                                        </button>
                                        <button class="btn btn-success btn-sm mx-1" v-if="sub_task.status == 0" @click="markAsComplete(sub_task)">
                                            Mark as complete
                                        </button>
                                        <button class="btn btn-success btn-sm mx-1" v-if="sub_task.status == 1" @click="markAsIncomplete(sub_task)">
                                            Mark as incomplete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="row mt-3 mb-3" v-for="(subTaskData, index) in subTaskDatas" :key="index">
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="title">Title</label>
                                <input type="text" class="form-control" v-model="subTaskData.title">
                                <span class="text-danger" v-show="subTaskErrors[index].title">Title is required</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="detail">Detail</label>
                                <input type="text" class="form-control" v-model="subTaskData.detail">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="start_date">Start date</label>
                                <input type="date" class="form-control" v-model="subTaskData.start_date">
                                <span class="text-danger" v-show="subTaskErrors[index].start_date">Start date is required</span>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="end_date">End date</label>
                                <input type="date" class="form-control" v-model="subTaskData.end_date">
                                <span class="text-danger" v-show="subTaskErrors[index].end_date">End date is required</span>
                            </div>
                        </div>
                        <div class="col-md-1" v-if="!subEditMode">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-6">
                                        <button @click="addSubTaskData" class="btn btn-success btn-sm mt-4">
                                            <h6>&plus;</h6>
                                        </button>
                                    </div>
                                    <div class="col-md-6">
                                        <button @click="removeSubTaskData(index)" v-if="subTaskDatas.length > 1 && index > 0" class="btn btn-danger btn-sm mt-4">
                                            <h6>&times;</h6>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <button class="btn btn-info btn-sm float-end mt-2" @click="!subEditMode ? storeSubTask() : updateSubTask()">
                                {{!subEditMode ? 'Store Sub Task' : 'Update Sub Task'}}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
            editMode: false,
            subEditMode: false,
            deleteMode: false,
            taskData: {
                id: '',
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
            subTaskDatas: [],
            subTaskErrors: [],
            sub_tasks: {},
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
        removeTask(task) {
            this.deleteMode = true
            this.taskData.id = task.id
            $('#taskModal').modal('show')
        },
        deleteTask(task) {
            axios.post('api/deleteTask/' + this.taskData.id).then(response => {
                this.getTasks()
                console.log(response.data)
            }).catch(errors => {
                console.log(errors)
            }).finally( () => {
                $('#taskModal').modal('hide')
            });
        },
        updateTask() {
            this.taskData.title == '' ? this.taskErrors.title = true : this.taskErrors.title = false
            this.taskData.date == '' ? this.taskErrors.date = true : this.taskErrors.date = false
            this.taskData.time == '' ? this.taskErrors.time = true : this.taskErrors.time = false

            if (this.taskData.title && this.taskData.date && this.taskData.time) {
                axios.post('api/updateTask/' + this.taskData.id, this.taskData).then(response => {
                    this.getTasks()
                    console.log(response.data)
                }).catch(errors => {
                    console.log(errors)
                }).finally( () => {
                    $('#taskModal').modal('hide')
                });
            }
        },
        editTask(task) {
            this.deleteMode = false
            this.editMode = true
            this.taskData = {
                id: task.id,
                title: task.title,
                date: task.date,
                time: task.time,
                detail: task.detail,
            }
            this.taskErrors = {
                title: false,
                date: false,
                time: false,
            }
            $('#taskModal').modal('show')
        },
        createTask() {
            this.deleteMode = false
            this.editMode = false
            this.taskData = {
                id: '',
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
                    this.getTasks()
                });
            }
        },
        showSubTasks(task) {
            this.subEditMode = false
            this.sub_tasks = task.sub_tasks
            this.subTaskDatas = [{
                id: '',
                task_id: task.id,
                title: '',
                detail: '',
                start_date: '',
                end_date: '',
            }];
            this.subTaskErrors = [{
                title: false,
                start_date: false,
                end_date: false,
            }];
            $('#subTaskModal').modal('show')
        },
        addSubTaskData() {
            this.subTaskDatas.push({
                id: '',
                task_id: this.subTaskDatas[0].task_id,
                title: '',
                detail: '',
                start_date: '',
                end_date: '',
            });
            this.subTaskErrors.push({
                title: false,
                start_date: false,
                end_date: false,
            });
        },
        removeSubTaskData(index) {
            this.subTaskDatas.splice(index, 1);
            this.subTaskErrors.splice(index, 1);
        },
        storeSubTask() {
            for(let i = 0; i < this.subTaskDatas.length; i++) {
                this.subTaskDatas[i].title == '' ? this.subTaskErrors[i].title = true : this.subTaskErrors[i].title = false;
                this.subTaskDatas[i].start_date == '' ? this.subTaskErrors[i].start_date = true : this.subTaskErrors[i].start_date = false;
                this.subTaskDatas[i].end_date == '' ? this.subTaskErrors[i].end_date = true : this.subTaskErrors[i].end_date = false;

                const result = this.subTaskDatas.every(subTask => {
                    return subTask.title && subTask.start_date && subTask.end_date
                });

                if(result) {
                    // window.emitter.emit('loadterStatus', true)
                    const t = this
                    // setTimeout(function () {
                        axios.post('api/storeSubTask', t.subTaskDatas).then(response => {
                            t.getTasks()
                            $('#subTaskModal').modal('hide')
                            console.log('success')
                            // window.emitter.emit('loadterStatus', false)
                        }).catch(errors => {
                            console.log(errors)
                            // window.emitter.emit('loadterStatus', false)
                        })
                    // }, 500)
                }
            }
        },
        editSubTask(sub_task) {
            this.subEditMode = true
            this.subTaskDatas = [{
                id: sub_task.id,
                task_id: sub_task.task_id,
                title: sub_task.title,
                detail: sub_task.detail,
                start_date: sub_task.start_date,
                end_date: sub_task.end_date,
            }];
            this.subTaskErrors = [{
                title: false,
                start_date: false,
                end_date: false,
            }];
            $('#subTaskModal').modal('show')
        },
        updateSubTask() {
            for(let i = 0; i < this.subTaskDatas.length; i++) {
                this.subTaskDatas[i].title == '' ? this.subTaskErrors[i].title = true : this.subTaskErrors[i].title = false;
                this.subTaskDatas[i].start_date == '' ? this.subTaskErrors[i].start_date = true : this.subTaskErrors[i].start_date = false;
                this.subTaskDatas[i].end_date == '' ? this.subTaskErrors[i].end_date = true : this.subTaskErrors[i].end_date = false;

                const result = this.subTaskDatas.every(subTask => {
                    return subTask.title && subTask.start_date && subTask.end_date
                });

                if(result) {
                    // window.emitter.emit('loadterStatus', true)
                    const t = this
                    // setTimeout(function () {
                    axios.post('api/updateSubTask/' + t.subTaskDatas[0].id, t.subTaskDatas).then(response => {
                        t.getTasks()
                        t.sub_tasks = response.data
                        console.log('success')
                        // window.emitter.emit('loadterStatus', false)
                    }).catch(errors => {
                        console.log(errors)
                        // window.emitter.emit('loadterStatus', false)
                    }).finally( () => {
                        t.subEditMode = false
                        t.subTaskDatas = [{
                            id: '',
                            task_id: this.subTaskDatas[0].task_id,
                            title: '',
                            detail: '',
                            start_date: '',
                            end_date: '',
                        }];
                        t.subTaskErrors = [{
                            title: false,
                            start_date: false,
                            end_date: false,
                        }];
                    });
                    // }, 500)
                }
            }
        },
        deleteSubTask(sub_task) {
            if(confirm('Are you sure you want to delete this sub task?')) {
                const t = this
                axios.post('api/deleteSubTask/' + sub_task.id).then(response => {
                    t.getTasks()
                    t.sub_tasks = response.data
                    console.log('success')
                }).catch(errors => {
                    console.log(errors)
                });
            }
        },
        markAsComplete(sub_task) {
            if(confirm('Are you sure you want to mark this sub task as complete?')) {
                const t = this
                axios.post('api/markAsComplete/' + sub_task.id).then(response => {
                    t.getTasks()
                    t.sub_tasks = response.data
                    console.log('success')
                }).catch(errors => {
                    console.log(errors)
                });
            }
        },
        markAsIncomplete(sub_task) {
            if(confirm('Are you sure you want to mark this sub task as incomplete?')) {
                const t = this
                axios.post('api/markAsIncomplete/' + sub_task.id).then(response => {
                    t.getTasks()
                    t.sub_tasks = response.data
                    console.log('success')
                }).catch(errors => {
                    console.log(errors)
                });
            }
        },
    }
}
</script>

<style scoped>

</style>
