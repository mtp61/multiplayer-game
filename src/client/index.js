// import other javascript
import { connect } from './networking';

console.log('wassup');

// import css
import './css/main.css';

Promise.all([
    connect()
])
.then(() => {

})