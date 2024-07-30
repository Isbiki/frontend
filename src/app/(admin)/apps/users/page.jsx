import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import useToggle from '@/hooks/useToggle';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const User = () => {
  const [users, setUsers] = useState();
  const [roles, setRoles] = useState();
  const [updatedUser, setUpdatedUser] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  // load users and roles info
  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get(`/users?search=${searchKey}`);
        if (res.data.success) {
          setUsers(res.data.data);
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
          setRoles(res.data.data);
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
  }, [searchKey]);
  //---------- Handle Create/Update user Modal ------------------------------------
  const {
    isTrue,
    toggle
  } = useToggle();

  const onCreate = () => {
    setIsUpdate(false);
    reset({
      name: '',
      email: '',
      password: '',
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
        password: ''
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
      const res = await httpClient.delete(`/users/${userId}`);
      if (res.data.success) {
        showNotification({
          message: 'Successfully deleted.',
          variant: 'success'
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
  const [selectedOption, setSelectedOption] = useState(1);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };
  const signUpSchema = yup.object({
    name: yup.string().required('please enter your name'),
    email: yup.string().email('Please enter a valid email').required('please enter your email'),
    password: yup.string().required('Please enter your password')
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
      password: ''
    }
  });
  const onSubmit = async (values) => {
    if (isUpdate) {
      try {
        console.log(values);
        console.log(selectedOption);
        const res = await httpClient.post(`/users/update/${updatedUser.id}`, values);
        if (res.data.success) {
          showNotification({
            message: 'Successfully updated.',
            variant: 'success'
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
    else {
      try {
        console.log(values);
        console.log(selectedOption);
        const res = await httpClient.post('/signup', values);
        if (res.data.success) {
          showNotification({
            message: 'Successfully created.',
            variant: 'success'
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
                    <th className="border-0 py-2">Created at</th>
                    <th className="border-0 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user, idx) => {
                    return <tr key={idx}>
                      <td>&nbsp;&nbsp;{idx + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td >{user.role_name}</td>
                      <td>{user.created_at}</td>
                      <td>
                        <Button variant="soft-secondary" size="sm" className="me-2" onClick={() => { onUpdate(user.id) }}>
                          <IconifyIcon icon="bx:edit" className="fs-16" />
                        </Button>
                        <Button variant="soft-danger" size="sm" type="button" onClick={() => { handleDeleteClick(user.id) }}>
                          <IconifyIcon icon="bx:trash" className="fs-16" />
                        </Button>
                      </td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
            <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
              <div className="col-sm">
                <div className="text-muted">
                  Showing&nbsp;
                  <span className="fw-semibold">10</span>&nbsp; of&nbsp;
                  <span className="fw-semibold">52</span>&nbsp; users
                </div>
              </div>
              <Col sm="auto" className="mt-3 mt-sm-0">
                <ul className="pagination pagination-rounded m-0">
                  <li className="page-item">
                    <Link to="" className="page-link">
                      <IconifyIcon icon="bx:left-arrow-alt" />
                    </Link>
                  </li>
                  <li className="page-item active">
                    <Link to="" className="page-link">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="" className="page-link">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="" className="page-link">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="" className="page-link">
                      <IconifyIcon icon="bx:right-arrow-alt" />
                    </Link>
                  </li>
                </ul>
              </Col>
            </div>
          </div>
        </Card>
      </Col>
    </Row>

    <Modal show={isTrue} className="fade" scrollable id="exampleModalScrollable" tabIndex={-1}>
      <ModalHeader>
        <h5 className="modal-title" id="exampleModalScrollableTitle">
          Create
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
          <TextFormInput control={control} name="name" containerClassName="mb-3" label="Name" id="name" placeholder="Enter your name" />
          <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />
          <PasswordFormInput control={control} name="password" containerClassName="mb-3" placeholder="Enter your password" id="password-id" label="Password" />
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
              {isUpdate ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
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
export default User;