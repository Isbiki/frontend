import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';

import { Modal, ModalBody, ModalFooter, ModalHeader, Pagination } from 'react-bootstrap';
import useToggle from '@/hooks/useToggle';
import TextFormInput from '@/components/form/TextFormInput';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';

const Roles = () => {
  const [roles, setroles] = useState();
  const [roleCount, setRoleCount] = useState(0);
  const [updatedRole, setupdatedRole] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const [items, setItems] = useState([]);
  const [dispNumber, setDispNumber] = useState(0);

  const [refreshFlag, setRefreshFlag] = useState(true);

  const {
    showNotification
  } = useNotificationContext();
  const {
    isTrue,
    toggle
  } = useToggle();


  // load roles and roles info

  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get(`/roles?search=${searchKey}`);
        if (res.data.success) {
          setroles(res.data.roles);
          let rolesLength = res.data.roles.length;
          setRoleCount(rolesLength);
          let temp = Math.floor(rolesLength / pageSize);
          setPageCount((rolesLength / pageSize > temp) ? temp + 1 : temp);
          if (rolesLength <= pageSize) {
            setDispNumber(rolesLength);
          }
          else {
            if (pageNumber < pageCount) {
              setDispNumber(pageSize);
            }
            else {
              setDispNumber(rolesLength - (pageNumber - 1) * pageSize);
            }
          }
        }
        else {
          setroles(null);
          setRoleCount(0);
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

    })();
  }, [searchKey, refreshFlag]);
  //---------- Handle Create/Update role Modal ------------------------------------

  const onCreate = () => {
    setIsUpdate(false);
    reset({
      name: '',
    });
    toggle();
  }
  const onUpdate = (roleId) => {
    setIsUpdate(true);
    roles.forEach((role, index) => {
      if (role.id === roleId) {
        setupdatedRole(role);
      }
    });
    toggle();
  };

  useEffect(() => {
    if (updatedRole) {
      reset({
        name: updatedRole.name,
      });
    }
  }, [updatedRole]);
  //------ Handle role delete ----------------------------------------
  const handleDeleteClick = (roleId) => {
    setRoleIdToDelete(roleId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (roleIdToDelete !== null) {
      onDelete(roleIdToDelete);
      setShowConfirmModal(false);
      setRoleIdToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setRoleIdToDelete(null);
  };
  const onDelete = async (roleId) => {
    try {
      const res = await httpClient.delete(`/roles/${roleId}`);
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
  });
  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
    }
  });
  const onSubmit = async (req) => {
    if (isUpdate) {
      try {
        const res = await httpClient.put(`/roles/${updatedRole.id}`, req);
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
    else {
      try {
        const res = await httpClient.post('/roles', req);
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
    if (roles?.length > 0) {
      if (roles.length <= pageSize) {
        setDispNumber(roles.length);
      }
      else {
        if (pageNumber < pageCount) {
          setDispNumber(pageSize);
        }
        else {
          setDispNumber(roles.length - (pageNumber - 1) * pageSize);
        }
      }
    }
  }, [pageNumber, pageCount]);

  return <>
    <PageBreadcrumb subName="Apps" title="Role" />
    <PageMetaData title="Role" />
    <Row>
      <Col>
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap justify-content-between gap-3">
              <div className="search-bar">
                <span>
                  <IconifyIcon icon="bx:search-alt" />
                </span>
                <input type="search" className="form-control" id="search" value={searchKey} placeholder="Search role..." onChange={(e) => { setSearchKey(e.target.value) }} />
              </div>
              <div>
                <Button variant="primary" className="d-inline-flex align-items-center" onClick={() => { onCreate() }}>
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Create Role
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
                    <th className="border-0 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roles?.map((role, idx) => {
                    if (idx >= pageSize * (pageNumber - 1) && idx < pageSize * pageNumber) {
                      return (
                        <tr key={role.id}>
                          <td>&nbsp;&nbsp;{idx + 1}</td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <div className="d-block">
                                <h5 className="mb-0 d-flex align-items-center gap-1">
                                  {role.name}
                                </h5>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Button
                              variant="soft-secondary"
                              size="sm"
                              className="me-2"
                              onClick={() => onUpdate(role.id)}
                            >
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              type="button"
                              onClick={() => handleDeleteClick(role.id)}
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
                  <span className="fw-semibold">{roleCount}</span>&nbsp; roles
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
        <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
          <TextFormInput control={control} name="name" containerClassName="mb-3" label="Name" id="name" placeholder="Enter role name" />
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
      <Modal.Body>Are you sure you want to delete this role?</Modal.Body>
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
export default Roles;