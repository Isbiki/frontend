import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';

import { Modal, ModalBody, ModalFooter, ModalHeader, Pagination } from 'react-bootstrap';
import useToggle from '@/hooks/useToggle';
import SelectFormInput from '@/components/form/SelectFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import ImageUpload from '@/components/ImageUpload';
import { SERVER_URL } from '@/helpers/serverUrl';

const defaultAvatarPath = 'uploads/dummy-avatar.jpg';

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

  const [refreshFlag, setRefreshFlag] = useState(true);

  const { showNotification } = useNotificationContext();
  const { isTrue, toggle } = useToggle();

  const [avatarPath, setAvatarPath] = useState(defaultAvatarPath);

  const handleAvatarPath = (path) => {
    setAvatarPath(path);
    setUpdatedUser({ ...updatedUser, 'avatar': path });
  }
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

  // Handle Create/Update user Modal 
  const onCreate = () => {
    setIsUpdate(false);
    reset({
      name: '',
      email: '',
      password: '',
      password2: '',
    });
    setAvatarPath(defaultAvatarPath);
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
      setValue('name', updatedUser?.name);
      setValue('email', updatedUser?.email);
      setValue('password', updatedUser?.password);
      setValue('password2', updatedUser?.password);
      setValue('role_id', updatedUser?.role_id);
      setAvatarPath(updatedUser.avatar);
    }
  }, [updatedUser]);

  // Handle User delete 
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
    setValue,
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
  const onCreateSubmit = async (values) => {
    try {
      let req = { ...values, 'avatar': avatarPath };
      const res = await httpClient.post('/signup', req);
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
  const onUpdateSubmit = async (values) => {
    try {
      let req = { 'role_id': values.role_id, 'avatar': updatedUser.avatar };
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

  const handlePermissionSetting = async (userId) => {
    let selectedUser = users.find(user => user.id === userId);
    selectedUser.permission = selectedUser.permission ? 0 : 1;
    const res = await httpClient.put(`/users/${userId}`, selectedUser);
    if (res.data.success) {
      showNotification({ message: res.data.message, variant: 'success' });
    }
    else {
      selectedUser.permission = selectedUser.permission ? 0 : 1;
    }
  }
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
                    <th className="border-0 py-2">Permission</th>
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
                              <img src={SERVER_URL + user.avatar} alt="avatar" className="avatar-sm rounded-circle" />
                              <div className="d-block">
                                <h5 className="mb-0 d-flex align-items-center gap-1">
                                  {user.name}
                                </h5>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.role_name}</td>
                          <td>
                            <div className="form-check form-switch">
                              <input className="form-check-input" type="checkbox" id="googleMailSwitch" checked={user.permission} onChange={() => { handlePermissionSetting(user.id) }} />
                            </div>
                          </td>
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
        <ImageUpload onSendPath={handleAvatarPath} defaultImgSrc={avatarPath} />
        {!isUpdate && (
          <>
            <form className="authentication-form" onSubmit={handleSubmit(onCreateSubmit)}>
              <TextFormInput control={control} name="name" containerClassName="mb-3" label="Name" id="name" placeholder="Enter your name" />
              <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />
              <PasswordFormInput control={control} name="password" containerClassName="mb-3" placeholder="Enter your password" id="password-id" label="Password" autoComplete="new-password" />
              <PasswordFormInput control={control} name="password2" containerClassName="mb-3" placeholder="confirm your password" id="password2-id" label="password2" autoComplete="new-password" />
              <label className="form-label">Role</label>
              <SelectFormInput
                control={control} name="role_id"
                value={2} options={roles?.map((role) => ({ value: role.id, label: role.name }))} >
              </SelectFormInput><br></br>
              <div className="mb-1 text-center d-grid">
                <Button variant="primary" type="submit">
                  Create
                </Button>
              </div>
            </form>
          </>
        )}
        {isUpdate && <>
          <form className="authentication-form" onSubmit={handleSubmit(onUpdateSubmit)}>
            <Row style={{ display: 'none' }}>
              <TextFormInput control={control} name="name" containerClassName="mb-3" label="Name" id="name" placeholder="Enter your name" />
              <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />
              <PasswordFormInput control={control} name="password" containerClassName="mb-3" placeholder="Enter your password" id="password-id" label="Password" autoComplete="new-password" />
              <PasswordFormInput control={control} name="password2" containerClassName="mb-3" placeholder="confirm your password" id="password2-id" label="password2" autoComplete="new-password" />
            </Row>
            <label className="form-label">Role</label>
            <SelectFormInput
              control={control} name="role_id"
              value={updatedUser.role_id} options={roles?.map((role) => ({ value: role.id, label: role.name }))} >
            </SelectFormInput>
            <br></br>
            <div className="mb-1 text-center d-grid">
              <Button variant="primary" type="submit">
                Update
              </Button>
            </div>
          </form>
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