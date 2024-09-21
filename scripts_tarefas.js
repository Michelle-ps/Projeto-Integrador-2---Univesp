document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('toggleCompletedBtn').addEventListener('click', toggleCompletedTasks);

function addTask() {
  var taskInput = document.getElementById('taskInput');
  var dateInput = document.getElementById('dateInput');
  var taskList = document.getElementById('taskList');
  var taskText = taskInput.value.trim();
  var taskDate = dateInput.value;

  if (taskText) {
    var listItem = document.createElement('li');
    var textSpan = document.createElement('span');
    var dateSpan = document.createElement('span');
    var completeCheckbox = document.createElement('input');
    var deleteButton = document.createElement('button');
    var editButton = document.createElement('button');
    var saveButton = document.createElement('button');

    textSpan.textContent = taskText;
    dateSpan.textContent = taskDate ? ' - ' + new Date(taskDate + 'T00:00:00').toLocaleDateString() : '';
    completeCheckbox.type = 'checkbox';
    deleteButton.textContent = 'Excluir';
    editButton.textContent = 'Editar';
    saveButton.textContent = 'Salvar';

    completeCheckbox.classList.add('complete');
    deleteButton.classList.add('delete');
    editButton.classList.add('edit');
    saveButton.classList.add('save');

    // Função de excluir tarefa
    deleteButton.onclick = function() {
      listItem.remove();
    };

    // Função de completar tarefa e movê-la para a lista de concluídas
    completeCheckbox.onclick = function() {
      var completedTaskList = document.getElementById('completedTaskList');
      if (completeCheckbox.checked) {
        completedTaskList.appendChild(listItem);  // Move tarefa para lista de concluídas
      } else {
        taskList.appendChild(listItem);  // Move tarefa de volta para a lista principal
      }
    };

    // Função de editar tarefa
    editButton.onclick = function() {
      var taskInputEdit = document.createElement('input');
      taskInputEdit.type = 'text';
      taskInputEdit.value = textSpan.textContent;

      var dateInputEdit = document.createElement('input');
      dateInputEdit.type = 'date';
      dateInputEdit.value = taskDate;

      listItem.replaceChild(taskInputEdit, textSpan);
      listItem.replaceChild(dateInputEdit, dateSpan);

      editButton.style.display = 'none';
      saveButton.style.display = 'inline';
    };

    // Função de salvar tarefa
    saveButton.onclick = function() {
      var taskInputEdit = listItem.querySelector('input[type="text"]');
      var dateInputEdit = listItem.querySelector('input[type="date"]');
      var newTaskText = taskInputEdit.value.trim();
      var newTaskDate = dateInputEdit.value;

      if (newTaskText) {
        textSpan.textContent = newTaskText;
      }

      if (newTaskDate) {
        taskDate = newTaskDate;
        dateSpan.textContent = ' - ' + new Date(taskDate + 'T00:00:00').toLocaleDateString();
      }

      listItem.replaceChild(textSpan, taskInputEdit);
      listItem.replaceChild(dateSpan, dateInputEdit);

      editButton.style.display = 'inline';
      saveButton.style.display = 'none';
    };

    saveButton.style.display = 'none';

    listItem.appendChild(completeCheckbox);
    listItem.appendChild(textSpan);
    listItem.appendChild(dateSpan);
    listItem.appendChild(editButton);
    listItem.appendChild(saveButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);

    taskInput.value = '';
    dateInput.value = '';
  }
}

// Função para alternar a visibilidade da lista de tarefas concluídas
function toggleCompletedTasks() {
  var completedTasks = document.getElementById('completedTasks');
  var toggleBtn = document.getElementById('toggleCompletedBtn');

  if (completedTasks.style.display === 'none') {
    completedTasks.style.display = 'block';
    toggleBtn.textContent = 'Ocultar Tarefas Concluídas';
  } else {
    completedTasks.style.display = 'none';
    toggleBtn.textContent = 'Mostrar Tarefas Concluídas';
  }
}

// AJAX para enviar tarefa ao backend
$(document).ready(function () {
  $('#addTaskBtn').on('click', function () {
    var taskInput = $('#taskInput').val();
    var dateInput = $('#dateInput').val();

    $.ajax({
      type: 'POST',
      url: '/add_task/',
      data: {
        'task_text': taskInput,
        'task_date': dateInput,
        csrfmiddlewaretoken: '{{ csrf_token }}',
      },
      success: function (data) {
        $('#taskList').append(data);
        $('#taskInput').val('');
        $('#dateInput').val('');
      }
    });
  });

  // Use event delegation to handle dynamic content
  $('#taskList').on('click', '.edit', function () {
    var listItem = $(this).closest('li');
    var textSpan = listItem.find('span').first();
    var dateSpan = listItem.find('span').last();
    
  });

  $('#taskList').on('click', '.delete', function () {
    $(this).closest('li').remove();
  });

  $('#taskList').on('click', '.complete', function () {
    $(this).closest('li').toggleClass('completed', this.checked);
  });
});
