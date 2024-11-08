const express = require('express');
const pool = require('./db');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());
app.listen(4000, () => {
    console.log('listening on 4000');
});
app.get('/UserData/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM signup where username = $1', [id]);
        if (user.rows.length === 0) {
            // Return an empty array if no user is found
            console.log(user.rows[0]);
            res.json([]);
        } else {
            // Return the user data if found
            console.log(user.rows[0]);
            res.json(user.rows[0]);
        }
        
        console.log(user.rows[0]);
    
    }catch(err){
        console.error(err);
    }
});

app.post('/UserData', async(req, res) => {
    try{
        const { username, email, password } = req.body;
        const newUser = await pool.query('INSERT INTO signup (username,email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
        res.json(newUser.rows[0]);
    }catch(err){
        console.error(err);
    }
});
app.get('/UserData/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM signup where username = $1', [id]);
        if (user.rows.length === 0) {
           
            
            res.json([]);
        } else {
            
            console.log(user.rows[0]);
            res.json(user.rows[0]);
        }
        
        console.log(user.rows[0]);
    
    }catch(err){
        console.error(err);
    }
});
app.post('/schedule', async(req, res) => {
    try{
        const { classroom_id, day, start_time, end_time, course } = req.body;
        const newUser = await pool.query('INSERT INTO schedule (classroom_id, day, start_time, end_time, course) VALUES ($1, $2, $3, $4, $5) RETURNING *', [classroom_id, day, start_time, end_time, course]);
        res.json(newUser.rows[0]);
    }catch(err){
        console.error(err);
    }
}
);
app.get('/schedule/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM schedule where classroom_id = $1', [id]);
        if (user.rows.length === 0) {
           
            
            res.json([]);
        } else {
            
            console.log(user.rows);
            res.json(user.rows);
        }
        
        console.log(user.rows[0]);
    
    }catch(err){
        console.error(err);
    }
}
);
app.post('/submit', async(req, res) => {
    try{
        const { id, fan, fan_comments, ac, ac_comments, projector, projector_comments, light, light_comments } = req.body;
        const newUser = await pool.query('INSERT INTO apply (id, fan, fan_comments, ac, ac_comments, projector, projector_comments, light, light_comments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [id, fan, fan_comments, ac, ac_comments, projector, projector_comments, light, light_comments]);   
        res.json(newUser.rows[0]);
    }catch(err){
        console.error(err);
    }
}
);

app.get('/admindata/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM apply,schedule where apply.id = schedule.classroom_id and apply.id = $1', [id]);
        if (user.rows.length === 0) {
           
            
            res.json([]);
        } else {
            
            console.log(user.rows);
            res.json(user.rows);
        }
        
        console.log(user.rows[0]);
    
    }catch(err){
        console.error(err);
    }
}
);
























// let connection;
// app.listen(5000, async() => {
//     connection = await oracle.getConnection({
//     user: 'HR',
//     password: '123',
//     connectString: 'localhost/xe'
// });

    
//     console.log('listening on 5000')});
// app.get('/', (req, res) => {
//     res.send('Hello World');
// }   );
 
// app.get('/UserData/:username', (req, res) => {
//     async function getData(){
//         try{
//             const res = await connection.execute('SELECT * FROM HR.signup WHERE USERNAME = :username', [req.params.username], {outFormat: oracle.OUT_FORMAT_OBJECT});
//             return res.rows;
//         }catch(err){
//             console.error(err);
//         }   
//     }
//     getData().then((result) => {
//         res.send(result);
//     }).catch((err) => {
//         res.send(err);
//     });
// });
// app.post('/UserData', (req, res) => {
//     async function postData(){
//         try{
//             const res = await connection.execute('INSERT INTO HR.signup (USERNAME, PASSWORD) VALUES (:username, :password)', [req.body.username, req.body.password], {autoCommit: true});
//             return res;
//         }catch(err){
//             console.error(err);
//         }
//     }
//     postData().then((result) => {
//         res.send(result);
//     }).catch((err) => {
//         res.send(err);
//     });
// });

