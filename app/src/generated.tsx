import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Cursor: any,
  Datetime: any,
  JSON: any,
};

export type Action = Node & {
   __typename?: 'Action',
  nodeId: Scalars['ID'],
  id: Scalars['Int'],
  type: Scalars['String'],
  sprintid?: Maybe<Scalars['String']>,
  userid: Scalars['String'],
  timestamp: Scalars['Datetime'],
  payload?: Maybe<Scalars['JSON']>,
  sprintBySprintid?: Maybe<Sprint>,
};

export type ActionCondition = {
  id?: Maybe<Scalars['Int']>,
  sprintid?: Maybe<Scalars['String']>,
  timestamp?: Maybe<Scalars['Datetime']>,
};

export type ActionInput = {
  id?: Maybe<Scalars['Int']>,
  type: Scalars['String'],
  sprintid?: Maybe<Scalars['String']>,
  userid: Scalars['String'],
  timestamp: Scalars['Datetime'],
  payload?: Maybe<Scalars['JSON']>,
};

export type ActionPatch = {
  id?: Maybe<Scalars['Int']>,
  type?: Maybe<Scalars['String']>,
  sprintid?: Maybe<Scalars['String']>,
  userid?: Maybe<Scalars['String']>,
  timestamp?: Maybe<Scalars['Datetime']>,
  payload?: Maybe<Scalars['JSON']>,
};

export type ActionsConnection = {
   __typename?: 'ActionsConnection',
  nodes: Array<Action>,
  edges: Array<ActionsEdge>,
  pageInfo: PageInfo,
  totalCount: Scalars['Int'],
};

export type ActionsEdge = {
   __typename?: 'ActionsEdge',
  cursor?: Maybe<Scalars['Cursor']>,
  node: Action,
};

export enum ActionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SprintidAsc = 'SPRINTID_ASC',
  SprintidDesc = 'SPRINTID_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type CreateActionInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  action: ActionInput,
};

export type CreateActionPayload = {
   __typename?: 'CreateActionPayload',
  clientMutationId?: Maybe<Scalars['String']>,
  action?: Maybe<Action>,
  query?: Maybe<Query>,
  sprintBySprintid?: Maybe<Sprint>,
  actionEdge?: Maybe<ActionsEdge>,
};


export type CreateActionPayloadActionEdgeArgs = {
  orderBy?: Maybe<Array<ActionsOrderBy>>
};

export type CreateSprintInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  sprint: SprintInput,
};

export type CreateSprintPayload = {
   __typename?: 'CreateSprintPayload',
  clientMutationId?: Maybe<Scalars['String']>,
  sprint?: Maybe<Sprint>,
  query?: Maybe<Query>,
  sprintEdge?: Maybe<SprintsEdge>,
};


export type CreateSprintPayloadSprintEdgeArgs = {
  orderBy?: Maybe<Array<SprintsOrderBy>>
};



export type DeleteActionByNodeIdInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  nodeId: Scalars['ID'],
};

export type DeleteActionInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  id: Scalars['Int'],
};

export type DeleteActionPayload = {
   __typename?: 'DeleteActionPayload',
  clientMutationId?: Maybe<Scalars['String']>,
  action?: Maybe<Action>,
  deletedActionNodeId?: Maybe<Scalars['ID']>,
  query?: Maybe<Query>,
  sprintBySprintid?: Maybe<Sprint>,
  actionEdge?: Maybe<ActionsEdge>,
};


export type DeleteActionPayloadActionEdgeArgs = {
  orderBy?: Maybe<Array<ActionsOrderBy>>
};

export type DeleteSprintByNodeIdInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  nodeId: Scalars['ID'],
};

export type DeleteSprintInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  id: Scalars['String'],
};

export type DeleteSprintPayload = {
   __typename?: 'DeleteSprintPayload',
  clientMutationId?: Maybe<Scalars['String']>,
  sprint?: Maybe<Sprint>,
  deletedSprintNodeId?: Maybe<Scalars['ID']>,
  query?: Maybe<Query>,
  sprintEdge?: Maybe<SprintsEdge>,
};


export type DeleteSprintPayloadSprintEdgeArgs = {
  orderBy?: Maybe<Array<SprintsOrderBy>>
};


export type ListenPayload = {
   __typename?: 'ListenPayload',
  query?: Maybe<Query>,
  relatedNode?: Maybe<Node>,
  relatedNodeId?: Maybe<Scalars['ID']>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createAction?: Maybe<CreateActionPayload>,
  createSprint?: Maybe<CreateSprintPayload>,
  updateActionByNodeId?: Maybe<UpdateActionPayload>,
  updateAction?: Maybe<UpdateActionPayload>,
  updateSprintByNodeId?: Maybe<UpdateSprintPayload>,
  updateSprint?: Maybe<UpdateSprintPayload>,
  deleteActionByNodeId?: Maybe<DeleteActionPayload>,
  deleteAction?: Maybe<DeleteActionPayload>,
  deleteSprintByNodeId?: Maybe<DeleteSprintPayload>,
  deleteSprint?: Maybe<DeleteSprintPayload>,
};


export type MutationCreateActionArgs = {
  input: CreateActionInput
};


export type MutationCreateSprintArgs = {
  input: CreateSprintInput
};


export type MutationUpdateActionByNodeIdArgs = {
  input: UpdateActionByNodeIdInput
};


export type MutationUpdateActionArgs = {
  input: UpdateActionInput
};


export type MutationUpdateSprintByNodeIdArgs = {
  input: UpdateSprintByNodeIdInput
};


export type MutationUpdateSprintArgs = {
  input: UpdateSprintInput
};


export type MutationDeleteActionByNodeIdArgs = {
  input: DeleteActionByNodeIdInput
};


export type MutationDeleteActionArgs = {
  input: DeleteActionInput
};


export type MutationDeleteSprintByNodeIdArgs = {
  input: DeleteSprintByNodeIdInput
};


export type MutationDeleteSprintArgs = {
  input: DeleteSprintInput
};

export type Node = {
  nodeId: Scalars['ID'],
};

export type PageInfo = {
   __typename?: 'PageInfo',
  hasNextPage: Scalars['Boolean'],
  hasPreviousPage: Scalars['Boolean'],
  startCursor?: Maybe<Scalars['Cursor']>,
  endCursor?: Maybe<Scalars['Cursor']>,
};

export type Query = Node & {
   __typename?: 'Query',
  query: Query,
  nodeId: Scalars['ID'],
  node?: Maybe<Node>,
  actions?: Maybe<ActionsConnection>,
  sprints?: Maybe<SprintsConnection>,
  action?: Maybe<Action>,
  sprint?: Maybe<Sprint>,
  actionByNodeId?: Maybe<Action>,
  sprintByNodeId?: Maybe<Sprint>,
};


export type QueryNodeArgs = {
  nodeId: Scalars['ID']
};


export type QueryActionsArgs = {
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  before?: Maybe<Scalars['Cursor']>,
  after?: Maybe<Scalars['Cursor']>,
  orderBy?: Maybe<Array<ActionsOrderBy>>,
  condition?: Maybe<ActionCondition>
};


export type QuerySprintsArgs = {
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  before?: Maybe<Scalars['Cursor']>,
  after?: Maybe<Scalars['Cursor']>,
  orderBy?: Maybe<Array<SprintsOrderBy>>,
  condition?: Maybe<SprintCondition>
};


export type QueryActionArgs = {
  id: Scalars['Int']
};


export type QuerySprintArgs = {
  id: Scalars['String']
};


export type QueryActionByNodeIdArgs = {
  nodeId: Scalars['ID']
};


export type QuerySprintByNodeIdArgs = {
  nodeId: Scalars['ID']
};

export type Sprint = Node & {
   __typename?: 'Sprint',
  nodeId: Scalars['ID'],
  id: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  actionsBySprintid: ActionsConnection,
};


export type SprintActionsBySprintidArgs = {
  first?: Maybe<Scalars['Int']>,
  last?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  before?: Maybe<Scalars['Cursor']>,
  after?: Maybe<Scalars['Cursor']>,
  orderBy?: Maybe<Array<ActionsOrderBy>>,
  condition?: Maybe<ActionCondition>
};

export type SprintCondition = {
  id?: Maybe<Scalars['String']>,
};

export type SprintInput = {
  id: Scalars['String'],
  title?: Maybe<Scalars['String']>,
};

export type SprintPatch = {
  id?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
};

export type SprintsConnection = {
   __typename?: 'SprintsConnection',
  nodes: Array<Sprint>,
  edges: Array<SprintsEdge>,
  pageInfo: PageInfo,
  totalCount: Scalars['Int'],
};

export type SprintsEdge = {
   __typename?: 'SprintsEdge',
  cursor?: Maybe<Scalars['Cursor']>,
  node: Sprint,
};

export enum SprintsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type Subscription = {
   __typename?: 'Subscription',
  listen: ListenPayload,
};


export type SubscriptionListenArgs = {
  topic: Scalars['String']
};

export type UpdateActionByNodeIdInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  nodeId: Scalars['ID'],
  patch: ActionPatch,
};

export type UpdateActionInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  patch: ActionPatch,
  id: Scalars['Int'],
};

export type UpdateActionPayload = {
   __typename?: 'UpdateActionPayload',
  clientMutationId?: Maybe<Scalars['String']>,
  action?: Maybe<Action>,
  query?: Maybe<Query>,
  sprintBySprintid?: Maybe<Sprint>,
  actionEdge?: Maybe<ActionsEdge>,
};


export type UpdateActionPayloadActionEdgeArgs = {
  orderBy?: Maybe<Array<ActionsOrderBy>>
};

export type UpdateSprintByNodeIdInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  nodeId: Scalars['ID'],
  patch: SprintPatch,
};

export type UpdateSprintInput = {
  clientMutationId?: Maybe<Scalars['String']>,
  patch: SprintPatch,
  id: Scalars['String'],
};

export type UpdateSprintPayload = {
   __typename?: 'UpdateSprintPayload',
  clientMutationId?: Maybe<Scalars['String']>,
  sprint?: Maybe<Sprint>,
  query?: Maybe<Query>,
  sprintEdge?: Maybe<SprintsEdge>,
};


export type UpdateSprintPayloadSprintEdgeArgs = {
  orderBy?: Maybe<Array<SprintsOrderBy>>
};

export type CreateActionMutationVariables = {
  type: Scalars['String'],
  sprintId: Scalars['String'],
  userId: Scalars['String'],
  timestamp: Scalars['Datetime'],
  payload: Scalars['JSON']
};


export type CreateActionMutation = (
  { __typename?: 'Mutation' }
  & { createAction: Maybe<(
    { __typename?: 'CreateActionPayload' }
    & Pick<CreateActionPayload, 'clientMutationId'>
  )> }
);

export type ActionAddedSubscriptionVariables = {
  topic: Scalars['String']
};


export type ActionAddedSubscription = (
  { __typename?: 'Subscription' }
  & { listen: (
    { __typename?: 'ListenPayload' }
    & { relatedNode: Maybe<{ __typename?: 'Query' } | (
      { __typename?: 'Action' }
      & Pick<Action, 'id' | 'type' | 'userid' | 'timestamp' | 'payload'>
    ) | { __typename?: 'Sprint' }> }
  ) }
);

export type SprintQueryVariables = {
  sprintId: Scalars['String'],
  cursor?: Maybe<Scalars['Cursor']>
};


export type SprintQuery = (
  { __typename?: 'Query' }
  & { sprint: Maybe<(
    { __typename?: 'Sprint' }
    & Pick<Sprint, 'id' | 'title'>
  )>, actions: Maybe<(
    { __typename?: 'ActionsConnection' }
    & { nodes: Array<(
      { __typename?: 'Action' }
      & Pick<Action, 'id' | 'type' | 'timestamp' | 'payload'>
    )> }
  )> }
);

export type CreateSprintMutationVariables = {
  id: Scalars['String']
};


export type CreateSprintMutation = (
  { __typename?: 'Mutation' }
  & { createSprint: Maybe<(
    { __typename?: 'CreateSprintPayload' }
    & { sprint: Maybe<(
      { __typename?: 'Sprint' }
      & Pick<Sprint, 'id'>
    )> }
  )> }
);


export const CreateActionDocument = gql`
    mutation CreateAction($type: String!, $sprintId: String!, $userId: String!, $timestamp: Datetime!, $payload: JSON!) {
  createAction(input: {action: {type: $type, sprintid: $sprintId, userid: $userId, timestamp: $timestamp, payload: $payload}}) {
    clientMutationId
  }
}
    `;
export type CreateActionMutationFn = ApolloReactCommon.MutationFunction<CreateActionMutation, CreateActionMutationVariables>;
export type CreateActionComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateActionMutation, CreateActionMutationVariables>, 'mutation'>;

    export const CreateActionComponent = (props: CreateActionComponentProps) => (
      <ApolloReactComponents.Mutation<CreateActionMutation, CreateActionMutationVariables> mutation={CreateActionDocument} {...props} />
    );
    
export type CreateActionProps<TChildProps = {}> = ApolloReactHoc.MutateProps<CreateActionMutation, CreateActionMutationVariables> & TChildProps;
export function withCreateAction<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  CreateActionMutation,
  CreateActionMutationVariables,
  CreateActionProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, CreateActionMutation, CreateActionMutationVariables, CreateActionProps<TChildProps>>(CreateActionDocument, {
      alias: 'createAction',
      ...operationOptions
    });
};
export type CreateActionMutationResult = ApolloReactCommon.MutationResult<CreateActionMutation>;
export type CreateActionMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateActionMutation, CreateActionMutationVariables>;
export const ActionAddedDocument = gql`
    subscription ActionAdded($topic: String!) {
  listen(topic: $topic) {
    relatedNode {
      ... on Action {
        id
        type
        userid
        timestamp
        payload
      }
    }
  }
}
    `;
export type ActionAddedComponentProps = Omit<ApolloReactComponents.SubscriptionComponentOptions<ActionAddedSubscription, ActionAddedSubscriptionVariables>, 'subscription'>;

    export const ActionAddedComponent = (props: ActionAddedComponentProps) => (
      <ApolloReactComponents.Subscription<ActionAddedSubscription, ActionAddedSubscriptionVariables> subscription={ActionAddedDocument} {...props} />
    );
    
export type ActionAddedProps<TChildProps = {}> = ApolloReactHoc.DataProps<ActionAddedSubscription, ActionAddedSubscriptionVariables> & TChildProps;
export function withActionAdded<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  ActionAddedSubscription,
  ActionAddedSubscriptionVariables,
  ActionAddedProps<TChildProps>>) {
    return ApolloReactHoc.withSubscription<TProps, ActionAddedSubscription, ActionAddedSubscriptionVariables, ActionAddedProps<TChildProps>>(ActionAddedDocument, {
      alias: 'actionAdded',
      ...operationOptions
    });
};
export type ActionAddedSubscriptionResult = ApolloReactCommon.SubscriptionResult<ActionAddedSubscription>;
export const SprintDocument = gql`
    query Sprint($sprintId: String!, $cursor: Cursor) {
  sprint(id: $sprintId) {
    id
    title
  }
  actions(condition: {sprintid: $sprintId}, orderBy: [ID_ASC], after: $cursor) {
    nodes {
      id
      type
      timestamp
      payload
    }
  }
}
    `;
export type SprintComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<SprintQuery, SprintQueryVariables>, 'query'> & ({ variables: SprintQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const SprintComponent = (props: SprintComponentProps) => (
      <ApolloReactComponents.Query<SprintQuery, SprintQueryVariables> query={SprintDocument} {...props} />
    );
    
export type SprintProps<TChildProps = {}> = ApolloReactHoc.DataProps<SprintQuery, SprintQueryVariables> & TChildProps;
export function withSprint<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SprintQuery,
  SprintQueryVariables,
  SprintProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, SprintQuery, SprintQueryVariables, SprintProps<TChildProps>>(SprintDocument, {
      alias: 'sprint',
      ...operationOptions
    });
};
export type SprintQueryResult = ApolloReactCommon.QueryResult<SprintQuery, SprintQueryVariables>;
export const CreateSprintDocument = gql`
    mutation createSprint($id: String!) {
  createSprint(input: {sprint: {id: $id}}) {
    sprint {
      id
    }
  }
}
    `;
export type CreateSprintMutationFn = ApolloReactCommon.MutationFunction<CreateSprintMutation, CreateSprintMutationVariables>;
export type CreateSprintComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateSprintMutation, CreateSprintMutationVariables>, 'mutation'>;

    export const CreateSprintComponent = (props: CreateSprintComponentProps) => (
      <ApolloReactComponents.Mutation<CreateSprintMutation, CreateSprintMutationVariables> mutation={CreateSprintDocument} {...props} />
    );
    
export type CreateSprintProps<TChildProps = {}> = ApolloReactHoc.MutateProps<CreateSprintMutation, CreateSprintMutationVariables> & TChildProps;
export function withCreateSprint<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  CreateSprintMutation,
  CreateSprintMutationVariables,
  CreateSprintProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, CreateSprintMutation, CreateSprintMutationVariables, CreateSprintProps<TChildProps>>(CreateSprintDocument, {
      alias: 'createSprint',
      ...operationOptions
    });
};
export type CreateSprintMutationResult = ApolloReactCommon.MutationResult<CreateSprintMutation>;
export type CreateSprintMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSprintMutation, CreateSprintMutationVariables>;