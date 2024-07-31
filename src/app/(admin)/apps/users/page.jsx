import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';

import { Modal, ModalBody, ModalFooter, ModalHeader, Pagination } from 'react-bootstrap';
import useToggle from '@/hooks/useToggle';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';

const Users = () => {
  const [users, setUsers] = useState();
  const [userCount, setUserCount] = useState(0);
  const [roles, setRoles] = useState();
  const [updatedUser, setUpdatedUser] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const [items, setItems] = useState([]);
  const [dispNumber, setDispNumber] = useState(0);

  const [selectedRole, setSelectedRole] = useState(1);
  const [refreshFlag, setRefreshFlag] = useState(true);

  const {
    showNotification
  } = useNotificationContext();
  const {
    isTrue,
    toggle
  } = useToggle();


  // load users and roles info

  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get(`/users?search=${searchKey}`);
        if (res.data.success) {
          setUsers(res.data.users);
          let usersLength = res.data.users.length;
          setUserCount(usersLength);
          let temp = Math.floor(usersLength / pageSize);
          setPageCount((usersLength / pageSize > temp) ? temp + 1 : temp);
          if (usersLength <= pageSize) {
            setDispNumber(usersLength);
          }
          else {
            if (pageNumber < pageCount) {
              setDispNumber(pageSize);
            }
            else {
              setDispNumber(usersLength - (pageNumber - 1) * pageSize);
            }
          }
        }
        else {
          setUsers(null);
          setUserCount(0);
          setPageNumber(1);
          setPageCount(1);
          setDispNumber(0);
          showNotification({
            message: res.data.message,
            variant: 'danger'
          });
        }
      } catch (e) {
        if (e.response?.data?.error) {
          showNotification({
            message: e.response?.data?.error,
            variant: 'danger'
          });
        }
      }
      try {
        const res = await httpClient.get('/roles');
        if (res.data.success) {
          setRoles(res.data.roles);
        }
      } catch (e) {
        if (e.response?.data?.error) {
          showNotification({
            message: e.response?.data?.error,
            variant: 'danger'
          });
        }
      }
    })();
  }, [searchKey, refreshFlag]);
  //---------- Handle Create/Update user Modal ------------------------------------

  const onCreate = () => {
    setIsUpdate(false);
    reset({
      name: '',
      email: '',
      password: '',
      password2: '',
      role: ''
    });
    toggle();
  }
  const onUpdate = (userId) => {
    setIsUpdate(true);
    users.forEach((user, index) => {
      if (user.id === userId) {
        setUpdatedUser(user);
      }
    });
    toggle();
  };

  useEffect(() => {
    if (updatedUser) {
      reset({
        name: updatedUser.name,
        email: updatedUser.email,
        password: '',
        password2: '',
      });
    }
  }, [updatedUser]);
  //------ Handle User delete ----------------------------------------
  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (userIdToDelete !== null) {
      onDelete(userIdToDelete);
      setShowConfirmModal(false);
      setUserIdToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setUserIdToDelete(null);
  };
  const onDelete = async (userId) => {
    try {
      console.log(userId);
      const res = await httpClient.delete(`/users/${userId}`);
      if (res.data.success) {
        showNotification({
          message: res.data.message,
          variant: 'success'
        });
        setRefreshFlag(!refreshFlag);
      }
      else {
        showNotification({
          message: res.data.message,
          variant: 'danger'
        });
      }
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification({
          message: e.response?.data?.error,
          variant: 'danger'
        });
      }
    }
  };

  const signUpSchema = yup.object({
    name: yup.string().required('please enter your name'),
    email: yup.string().email('Please enter a valid email').required('please enter your email'),
    password: yup.string().required('Please enter your password'),
    password2: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  });
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password2: '',
    }
  });
  const onSubmit = async (values) => {
    try {
      let req = { ...values, 'role': selectedRole };
      const res = await httpClient.post('/users', req);
      if (res.data.success) {
        showNotification({
          message: res.data.message,
          variant: 'success'
        });
        toggle();
        setRefreshFlag(!refreshFlag);
      }
      else {
        showNotification({
          message: res.data.message,
          variant: 'danger'
        });
      }
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification({
          message: e.response?.data?.error,
          variant: 'danger'
        });
      }
    }
  }
  const onUpdateClicked = async () => {
    try {
      let req = { 'role': selectedRole };
      const res = await httpClient.put(`/users/${updatedUser.id}`, req);
      if (res.data.success) {
        showNotification({
          message: res.data.message,
          variant: 'success'
        });
        toggle();
        setRefreshFlag(!refreshFlag);
      }
      else {
        showNotification({
          message: res.data.message,
          variant: 'danger'
        });
      }
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification({
          message: e.response?.data?.error,
          variant: 'danger'
        });
      }
    }

  }

  // --------- Role selection in Create/Update modal ---------------------


  const handleSelectChange = (value) => {
    setSelectedRole(value);
  };
  // -------- Pagination -------------
  useEffect(() => {
    let pages = [];
    for (let number = 1; number <= pageCount; number++) {
      pages.push(<Pagination.Item key={number} active={number === pageNumber} onClick={() => { setPageNumber(number) }}>
        {number}
      </Pagination.Item>);
    }
    setItems(pages);
    if (users?.length > 0) {
      if (users.length <= pageSize) {
        setDispNumber(users.length);
      }
      else {
        if (pageNumber < pageCount) {
          setDispNumber(pageSize);
        }
        else {
          setDispNumber(users.length - (pageNumber - 1) * pageSize);
        }
      }
    }
  }, [pageNumber, pageCount]);

  return <>
    <PageBreadcrumb subName="Apps" title="User" />
    <PageMetaData title="User" />
    <Row>
      <Col>
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap justify-content-between gap-3">
              <div className="search-bar">
                <span>
                  <IconifyIcon icon="bx:search-alt" />
                </span>
                <input type="search" className="form-control" id="search" value={searchKey} placeholder="Search user..." onChange={(e) => { setSearchKey(e.target.value) }} />
              </div>
              <div>
                <Button variant="primary" className="d-inline-flex align-items-center" onClick={() => { onCreate() }}>
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Create User
                </Button>
              </div>
            </div>
          </CardBody>
          <div>
            <div className="table-responsive table-centered">
              <table className="table text-nowrap mb-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="border-0 py-2">&nbsp;&nbsp;No</th>
                    <th className="border-0 py-2">Name</th>
                    <th className="border-0 py-2">Email</th>
                    <th className="border-0 py-2">Role</th>
                    <th className="border-0 py-2">Created at</th>
                    <th className="border-0 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user, idx) => {
                    if (idx >= pageSize * (pageNumber - 1) && idx < pageSize * pageNumber) {
                      return (
                        <tr key={user.id}>
                          <td>&nbsp;&nbsp;{idx + 1}</td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <img src={user.avatar} alt="avatar" className="avatar-sm rounded-circle" />
                              <div className="d-block">
                                <h5 className="mb-0 d-flex align-items-center gap-1">
                                  {user.name}
                                </h5>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.role_name}</td>
                          <td>{user.created_at}</td>
                          <td>
                            <Button
                              variant="soft-secondary"
                              size="sm"
                              className="me-2"
                              onClick={() => onUpdate(user.id)}
                            >
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              type="button"
                              onClick={() => handleDeleteClick(user.id)}
                            >
                              <IconifyIcon icon="bx:trash" className="fs-16" />
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                    return null; // Return null for elements not rendered  
                  })}
                </tbody>
              </table>
            </div>
            <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
              <div className="col-sm">
                <div className="text-muted">
                  Showing&nbsp;
                  <span className="fw-semibold">{dispNumber}</span>&nbsp; of&nbsp;
                  <span className="fw-semibold">{userCount}</span>&nbsp; users
                </div>
              </div>
              <nav aria-label="Page navigation example">
                <Pagination className="justify-content-end mb-0">
                  <Pagination.Prev onClick={() => { pageNumber > 1 ? setPageNumber(pageNumber - 1) : setPageNumber(pageNumber) }}>Previous</Pagination.Prev>
                  {items}
                  <Pagination.Next onClick={() => { pageNumber < pageCount ? setPageNumber(pageNumber + 1) : setPageNumber(pageNumber) }}>Next</Pagination.Next>
                </Pagination>
              </nav>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <Modal show={isTrue} className="fade" id="exampleModalScrollable" tabIndex={-1}>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalScrollableTitle">
          {isUpdate ? 'Update' : 'Create'}
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        {!isUpdate && (
          <>
            <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
              <TextFormInput control={control} name="name" containerClassName="mb-3" label="Name" id="name" placeholder="Enter your name" />
              <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />
              <PasswordFormInput control={control} name="password" containerClassName="mb-3" placeholder="Enter your password" id="password-id" label="Password" autoComplete="new-password" />
              <PasswordFormInput control={control} name="password2" containerClassName="mb-3" placeholder="confirm your password" id="password2-id" label="password2" autoComplete="new-password" />
              <label className="form-label">Role</label>
              <ChoicesFormInput options={{
                removeItemButton: true,
                searchEnabled: false
              }} onChange={handleSelectChange} value={isUpdate ? updatedUser.role_name : 'guest'}>
                {roles?.map((role, idx) => (
                  <option key={idx} value={role.name}>{role.name}</option>
                ))}
              </ChoicesFormInput>
              <div className="mb-1 text-center d-grid">
                <Button variant="primary" type="submit">
                  Create
                </Button>
              </div>
            </form>
          </>
        )}
        {isUpdate && <>
          <label className="form-label">Role</label>
          <ChoicesFormInput options={{
            removeItemButton: true,
            searchEnabled: false
          }} onChange={handleSelectChange} value={isUpdate ? updatedUser.role_name : 'guest'}>
            {roles?.map((role, idx) => (
              <option key={idx} value={role.name}>{role.name}</option>
            ))}
          </ChoicesFormInput>
          <div className="mb-1 text-center d-grid">
            <Button variant="primary" onClick={onUpdateClicked}>
              Update
            </Button>
          </div>
        </>}
      </ModalBody>
      <ModalFooter>

      </ModalFooter>
    </Modal>

    <Modal show={showConfirmModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  </>
};
export default Users;