import Column from "./classes/Column/Column";

const todo = new Column('todo');
const progress = new Column('in progress');
const done = new Column('done');

todo.render();
progress.render();
done.render();