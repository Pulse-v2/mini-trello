import { gql } from '@apollo/client';

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($columnId: String!, $content: String!) {
    createTask(columnId: $columnId, content: $content) {
      id
      columnId
      content
      createdDate
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $status: String) {
  updateTask(id: $id, title: $title, description: $description, status: $status) {
    id
    title
    description
    status
  }
}
`;

export const DELETE_TASK_MUTATION = gql`
mutation DeleteTask($id: ID!) {
  deleteTask(id: $id) {
    id
  }
}
`;