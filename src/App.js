import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';

import 'bootstrap/dist/css/bootstrap.min.css';


const BASE_API = 'http://localhost:8000/api';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [classes, setClasses] = useState([]);
  const [cls, setCls] = useState();
  const [clsName, setClsName] = useState('');
  const [clsTeacher, setClsTeacher] = useState();
  const [clsStudentURLs, setClsStudentURLs] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState();
  const [teacherName, setTeacherName] = useState('');

  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState();
  const [studentName, setStudentName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  const handleLogin = (event) => {
    event.preventDefault();

    fetch(`${BASE_API}/token-auth/`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      }), 
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', username);
          window.location.reload();
        });
      } else {
        setErrorMessage('Username or password is incorrect');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  };
  
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };
  
  const isAuthenticated = !!localStorage.getItem('token');

  /////////////////////////////////////////////////////////

  const fetchClasses = () => {
    fetch(`${BASE_API}/classes/`, {
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          setClasses(data);
        });
      } else {
        setErrorMessage('Could not fetch classes');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  };

  const handleCreateClass = (event) => {
    event.preventDefault();

    if (clsStudentURLs.length === 0) {
      setErrorMessage('Please select at least one student.');
      return;
    }

    fetch(`${BASE_API}/classes/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: clsName,
        teacher: clsTeacher,
        students: clsStudentURLs
      }), 
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          window.location.pathname = '/classes';
        });
      } else {
        alert('Could not create class');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const fetchClass = (url) => {
    fetch(url, {
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          setCls(data);
          setClsName(data.name);
          setClsTeacher(data.teacher);
        });
      } else {
        setErrorMessage('Could not fetch class');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const handleUpdateClass = (event) => {
    event.preventDefault();

    if (clsStudentURLs.length === 0) {
      setErrorMessage('Please select at least one student.');
      return;
    }

    fetch(cls.url, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: clsName,
        teacher: clsTeacher,
        students: clsStudentURLs
      }), 
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          window.location.pathname = '/classes';
        });
      } else {
        alert('Could not update class');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const handleDeleteClass = () => {
    if(window.confirm(`Please confirm to delete class ${cls.name}`) !== true) return;

    fetch(cls.url, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        window.location.pathname = '/classes';
      } else {
        setErrorMessage('Could not delete class');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  /////////////////////////////////////////////////////////

  const fetchTeachers = () => {
    fetch(`${BASE_API}/teachers/`, {
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          setTeachers(data);
          setClsTeacher(data[0]?.url);
        });
      } else {
        setErrorMessage('Could not fetch teachers');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  };

  const handleCreateTeacher = (event) => {
    event.preventDefault();

    fetch(`${BASE_API}/teachers/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: teacherName,
      }), 
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          window.location.pathname = '/teachers';
        });
      } else {
        alert('Could not create teacher');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const fetchTeacher = (url) => {
    fetch(url, {
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          setTeacher(data);
          setTeacherName(data.name);
        });
      } else {
        setErrorMessage('Could not fetch teacher');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const handleUpdateTeacher = (event) => {
    event.preventDefault();

    fetch(teacher.url, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: teacherName,
      }), 
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          window.location.pathname = '/teachers';
        });
      } else {
        alert('Could not update teacher');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const handleDeleteTeacher = () => {
    if(window.confirm(`Please confirm to delete teacher ${teacher.name}`) !== true) return;

    fetch(teacher.url, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        window.location.pathname = '/teachers';
      } else {
        setErrorMessage('Could not delete teacher');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  /////////////////////////////////////////////////////////

  const fetchStudents = () => {
    fetch(`${BASE_API}/students/`, {
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          setStudents(data);
        });
      } else {
        setErrorMessage('Could not fetch students');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  };

  const handleCreateStudent = (event) => {
    event.preventDefault();

    fetch(`${BASE_API}/students/`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: studentName,
      }), 
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          window.location.pathname = '/students';
        });
      } else {
        alert('Could not create student');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const fetchStudent = (url) => {
    fetch(url, {
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          setStudent(data);
          setStudentName(data.name);
        });
      } else {
        setErrorMessage('Could not fetch student');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  };

  const handleUpdateStudent = (event) => {
    event.preventDefault();

    fetch(student.url, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        name: studentName,
      }), 
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          window.location.pathname = '/students';
        });
      } else {
        alert('Could not update student');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  const handleDeleteStudent = () => {
    if(window.confirm(`Please confirm to delete student ${student.name}`) !== true) return;

    fetch(student.url, {
      method: 'DELETE',
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    })
    .then(response => {
      if (response.ok) {
        window.location.pathname = '/students';
      } else {
        setErrorMessage('Could not delete student');
      }
    })
    .catch(error => {
      console.error('Error: ' + error);
      alert(error);
    });
  }

  useEffect(() => {
    switch (path) {
      case '/':
      case '/classes':
        fetchClasses();
        break;
      case '/class-create':
        fetchTeachers();
        fetchStudents();
        break;
      case '/class-detail':
        fetchClass(searchParams.get('url'));
        fetchTeachers();
        fetchStudents();
        break;
      case '/teachers':
        fetchTeachers();
        break;
      case '/teacher-create':
        break;
      case '/teacher-detail':
        fetchTeacher(searchParams.get('url'));
        break;
      case '/students':
        fetchStudents();
        break;
      case '/student-create':
        break;
      case '/student-detail':
        fetchStudent(searchParams.get('url'));
        break;
      default:
        break;
    }
    // eslint-disable-next-line
  }, [path]);

  useEffect(() => {
    if (cls && students) {
      setClsStudentURLs(students.filter(stu => stu.cclass === cls.url).map(stu => stu.url));
    }
  }, [cls, students]);

  const handleSelectClsStudents = (event) => {
    const studentUrl = event.target.value;
    if (event.target.checked) {
      setClsStudentURLs(prev => [
        ...prev,
        studentUrl
      ]);
    } else {
      setClsStudentURLs(clsStudentURLs.filter(stu => stu !== studentUrl));
    }
  }
  
  const renderLoginPage = (
    <Container>
      <h1>Sign In</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" onChange={(event) => setUsername(event.target.value)} />
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>

        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );

  const renderHeader = (
    <div>
      <div style={{textAlign: 'right'}}>
        <span>Welcome <strong>{localStorage.getItem('user')}</strong>, </span>
        <a href='/' onClick={handleLogout}>Logout</a>
      </div>

      <Nav>
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/classes">Classes</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/teachers">Teachers</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/students">Students</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );

  const renderClasses = (
    <>
      <h1>Classes</h1>
      <div style={{textAlign: 'right', marginBottom: '10px'}}>
        <Button href="/class-create">Add</Button>
      </div>
      <Table responsive bordered>
        <thead>
          <tr>
            <th>Class</th>
            <th>Teacher</th>
            <th>Student Count</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(c => (
            <tr key={c.id}>
              <td><a href={`/class-detail?url=${encodeURIComponent(c.url)}`}>{c.name}</a></td>
              <td>{c.teacher_name}</td>
              <td>{c.student_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderClassCreate = (
    <>
      <h1>Class Create</h1>
      <Form onSubmit={handleCreateClass}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" onChange={(event) => setClsName(event.target.value)} />
        </Form.Group>
  
        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Form.Select value={clsTeacher} onChange={(event) => setClsTeacher(event.target.value)}>
            {teachers.map(t => (
              <option key={t.id} value={t.url}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Students ({clsStudentURLs.length})</Form.Label>
          {students.filter(stu => !stu.cclass).map(stu => (
            <Form.Check key={stu.id} value={stu.url} label={stu.name} onChange={handleSelectClsStudents} />
          ))}
          {students.filter(stu => !stu.cclass).length === 0 && (
            <p style={{color: 'orange'}}>No students to asign, please add students first.</p>
          )}
        </Form.Group>

        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  )

  const renderClassDetail = (
    <>
      <h1>Class Detail</h1>
      <Form onSubmit={handleUpdateClass}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={clsName} onChange={(event) => setClsName(event.target.value)} />
        </Form.Group>
  
        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Form.Select value={clsTeacher} onChange={(event) => setClsTeacher(event.target.value)}>
            {teachers.map(t => (
              <option key={t.id} value={t.url}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Students ({clsStudentURLs.length})</Form.Label>
          {students.filter(stu => !stu.cclass || stu.cclass === cls?.url).map(stu => (
            <Form.Check
              key={stu.id}
              id={`check-cls-stu-${stu.id}`}
              name="check-cls-stu"
              value={stu.url}
              label={stu.name}
              onChange={handleSelectClsStudents}
              checked={!!clsStudentURLs.includes(stu.url)} />
          ))}
        </Form.Group>

        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="danger" onClick={handleDeleteClass} style={{marginLeft: '10px'}}>
          Delete
        </Button>
      </Form>
    </>
  );

  const renderTeachers = (
    <>
      <h1>Teachers</h1>
      <div style={{textAlign: 'right', marginBottom: '10px'}}>
        <Button href="/teacher-create">Add</Button>
      </div>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class Count</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.id}>
              <td><a href={`/teacher-detail?url=${encodeURIComponent(t.url)}`}>{t.name}</a></td>
              <td>{t.class_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderTeacherCreate = (
    <>
      <h1>Teacher Create</h1>
      <Form onSubmit={handleCreateTeacher}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" onChange={(event) => setTeacherName(event.target.value)} />
        </Form.Group>

        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  );

  const renderTeacherDetail = (
    <>
      <h1>Teacher Detail</h1>
      <Form onSubmit={handleUpdateTeacher}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={teacherName} onChange={(event) => setTeacherName(event.target.value)} />
        </Form.Group>

        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="danger" onClick={handleDeleteTeacher} style={{marginLeft: '10px'}}>
          Delete
        </Button>
      </Form>
    </>
  );

  const renderStudents = (
    <>
      <h1>Students</h1>
      <div style={{textAlign: 'right', marginBottom: '10px'}}>
        <Button href="/student-create">Add</Button>
      </div>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map(stu => (
            <tr key={stu.id}>
              <td><a href={`/student-detail?url=${encodeURIComponent(stu.url)}`}>{stu.name}</a></td>
              <td>{stu.class_name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderStudentCreate = (
    <>
      <h1>Student Create</h1>
      <Form onSubmit={handleCreateStudent}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" onChange={(event) => setStudentName(event.target.value)} />
        </Form.Group>

        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </>
  );

  const renderStudentDetail = (
    <>
      <h1>Student Detail</h1>
      <Form onSubmit={handleUpdateStudent}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={studentName} onChange={(event) => setStudentName(event.target.value)} />
        </Form.Group>

        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="danger" onClick={handleDeleteStudent} style={{marginLeft: '10px'}}>
          Delete
        </Button>
      </Form>
    </>
  );
  
  const renderMainPage = (
    <Container>
      {renderHeader}

      {path === '/' && renderClasses}

      {path === '/classes' && renderClasses}

      {path === '/class-create' && renderClassCreate}

      {path === '/class-detail' && renderClassDetail}
      
      {path === '/teachers' && renderTeachers}

      {path === '/teacher-create' && renderTeacherCreate}

      {path === '/teacher-detail' && renderTeacherDetail}

      {path === '/students' && renderStudents}

      {path === '/student-create' && renderStudentCreate}
      
      {path === '/student-detail' && renderStudentDetail}
    </Container>
  );

  return (
    <div>
      {!isAuthenticated && renderLoginPage}
      {isAuthenticated && renderMainPage}
    </div>
  )
}

export default App;
