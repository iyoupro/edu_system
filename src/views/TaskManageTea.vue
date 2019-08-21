<template>
  <div>
    <HeaderNav></HeaderNav>
    <el-row type="flex"
            justify="center">
      <el-col :span="16">
        <el-table :data="allTeaTask.filter(data => !searchCourse || data.name.toLowerCase().includes(searchCourse.toLowerCase())).slice((currentPage-1)*pageSize,currentPage*pageSize)"
                  style="width: 100%">
          <el-table-column label="课程名称"
                           prop="name"></el-table-column>
          <el-table-column label="下发时间"
                           prop="submitDate"></el-table-column>
          <el-table-column label="状态"
                           prop="status"></el-table-column>
          <el-table-column align="right">
            <template slot="header"
                      slot-scope="scope">
              <el-input v-model="searchCourse"
                        size="mini"
                        placeholder="输入课程名搜索" />
            </template>
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="getTeaTaskGrade(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini"
                         type="danger"
                         @click="deleteTask(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tabListPage">
          <el-pagination @current-change="handleCurrentChange"
                         :current-page="currentPage"
                         :page-size="pageSize"
                         layout="prev, pager, next"
                         :total="allTeaTask.filter(data => !searchCourse || data.name.toLowerCase().includes(searchCourse.toLowerCase())).length">
          </el-pagination>
        </div>
        <el-button type="primary"
                   @click="newTaskVisible = true">新建作业</el-button>
      </el-col>
    </el-row>

    <el-dialog title="新建作业"
               :visible.sync="newTaskVisible">
      <el-form :model="newTask"
               status-icon
               :rules="newTaskRules"
               ref="newTaskForm"
               class="newTaskForm">
        <el-form-item label="任务要求"
                      :label-width="formLabelWidth"
                      prop='appendix'>
          <el-input type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="newTask.appendix"></el-input>
        </el-form-item>
        <el-form-item label="课程名称"
                      :label-width="formLabelWidth"
                      prop="course">
          <el-select v-model="newTask.course"
                     placeholder="请选择课程">
            <template v-for="course in teaCourse">
              <el-option :label="course.name"
                         :key="course.taskId"
                         :value="course.taskId" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期"
                      :label-width="formLabelWidth"
                      prop="date">
          <el-date-picker v-model="newTask.date"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="newTaskVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addNewTask">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="作业管理"
               :visible.sync="outerVisible">
      <el-dialog width="30%"
                 title="评分"
                 :visible.sync="innerVisible"
                 append-to-body>
        <div>
          <p>姓名:{{currentStuTask.student[0].name ? currentStuTask.student[0].name : ''}}</p>
          <p>上交时间:{{currentStuTask.submitDate}}</p>
          <el-divider></el-divider>
          <p>{{assessInfo.file ? assessInfo.file : '没有内容'}}</p>
          <el-divider></el-divider>
          <el-form label-position="left"
                   label-width="80px"
                   status-icon
                   :model="assessInfo"
                   :rules="assessInfoRules"
                   ref="assessForm"
                   class="assessForm">
            <el-form-item label="成绩"
                          prop="grade">
              <el-input type="text"
                        v-model="assessInfo.grade"></el-input>
            </el-form-item>
            <el-form-item label="点评"
                          prop="assess">
              <el-input type="textarea"
                        :rows="2"
                        v-model="assessInfo.assess"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="updateTaskGrade">确定</el-button>
        </div>
      </el-dialog>
      <div>
        <p>课程名:{{currentTask.name}}</p>
        <p>任务描述:{{currentTask.appendix ? currentTask.appendix : '暂无描述'}}</p>
        <p>截止日期:{{currentTask.lastDate}}</p>
        <p>状态:{{currentTask.status}}</p>
        <el-divider></el-divider>
        <el-table :data="currentTaskGrade.filter(data => !search || data.student[0].name.toLowerCase().includes(search.toLowerCase())).slice((currentTaskPage-1)*taskPageSize,currentTaskPage*taskPageSize)"
                  style="width: 100%">
          <el-table-column label="姓名"
                           prop="student[0].name"></el-table-column>
          <el-table-column label="上传时间"
                           prop="submitDate"></el-table-column>
          <el-table-column label="成绩"
                           prop="grade"></el-table-column>
          <el-table-column align="right">
            <template slot="header"
                      slot-scope="scope">
              <el-input v-model="search"
                        size="mini"
                        placeholder="输入姓名搜索" />
            </template>
            <template slot-scope="scope">
              <el-button size="mini"
                         type="primary"
                         @click="assessTask(scope.$index, scope.row)">评分</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleTaskCurrentChange"
                       :current-page="currentTaskPage"
                       :page-size="taskPageSize"
                       layout="prev, pager, next"
                       :total="currentTaskGrade.filter(data => !search || data.student[0].name.toLowerCase().includes(search.toLowerCase())).length">
        </el-pagination>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="outerVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HeaderNav from "../components/HeaderNav";
export default {
  components: { HeaderNav },
  data () {
    const validateGrade = (rule, value, callback) => {
      value = parseFloat(value).toString();
      if (value == "NaN") {
        callback(new Error("成绩必须为数字!"));
      } else if (value > 100 || value < 0) {
        callback(new Error("成绩必须在0到100之间!"));
      } else {
        callback();
      }
    };
    return {
      currentPage: 1,
      pageSize: 10,
      currentTaskPage: 1,
      taskPageSize: 5,
      allTeaTask: [],
      currentTask: [],
      currentStuTask: { student: [{ name: "" }] },
      currentTaskGrade: [],
      searchCourse: "",
      assessInfo: {
        grade: "",
        access: ""
      },
      assessInfoRules: {
        grade: [
          {
            required: true,
            message: "成绩不得为空",
            trigger: "blur"
          },
          {
            validator: validateGrade,
            trigger: "blur"
          }
        ]
      },
      newTask: {
        appendix: "",
        course: "",
        date: ""
      },
      newTaskRules: {
        course: [
          {
            required: true,
            message: "请选择课程",
            trigger: "blur"
          }
        ],
        date: [
          {
            required: true,
            message: "请选择截止日期",
            trigger: "blur"
          }
        ]
      },
      teaCourse: [],
      search: "",
      newTaskVisible: false,
      formLabelWidth: "80px",
      fileList: [],
      outerVisible: false,
      innerVisible: false
    };
  },
  methods: {
    handleCurrentChange (val) {
      // 改变默认的页数
      this.currentPage = val;
    },
    handleTaskCurrentChange (val) {
      this.currentTaskPage = val;
    },
    getTeaTaskGrade (index, row) {
      this.currentTaskPage = 1;
      this.outerVisible = true;
      this.currentTask = row;
      this.$axios
        .post("/api/task/getTeaTaskGrade", { _id: row._id })
        .then(res => {
          if (res.data.statu) {
            this.currentTaskGrade = JSON.parse(res.data.allTaskGrade);
          } else {
            this.currentTaskGrade.length = 0;
            this.currentTaskGrade = [];
          }
        });
    },
    deleteTask (index, row) {
      this.$confirm("此操作将永久删除该作业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/api/task/deleteTask", { _id: row._id })
            .then(res => {
              if (res.data.statu) {
                this.allTeaTask.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateTaskGrade () {
      this.$refs["assessForm"].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/task/updateTaskGrade", {
              _id: this.currentStuTask._id,
              grade: this.assessInfo.grade,
              evaluate: this.assessInfo.access
            })
            .then(res => {
              if (res.data.statu) {
                this.currentStuTask.grade = this.assessInfo.grade;
                this.$message({
                  type: "success",
                  message: "提交成功!"
                });
                this.innerVisible = false;
              }
            });
        }
      });
    },
    addNewTask () {
      console.log(this.newTask);
      this.$refs["newTaskForm"].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/task/addNewTask", this.newTask)
            .then(res => {
              if (res.data.statu) {
                this.$message({
                  type: "success",
                  message: "新建成功!"
                });
                this.getTeaTask();
                this.newTaskVisible = false;
              }
            });
        }
      });
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    assessTask (index, row) {
      this.assessInfo.grade = "";
      this.assessInfo.access = "";
      this.innerVisible = true;
      this.currentStuTask = row;
      console.log(this.currentStuTask);
    },
    getTeaTask () {
      this.$axios
        .post("/api/task/getTeaTask", { teacherId: "tea1" })
        .then(res => {
          console.log(res.data);
          this.allTeaTask = res.data.teaTasks;
          this.teaCourse = res.data.teaCourses;
        });
    }
  },
  created () {
    this.getTeaTask();
  }
};
</script>