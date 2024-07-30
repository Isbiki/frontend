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

const Role = () => {
  const [roles, setRoles] = useState();
  const [updatedRole, setUpdatedRole] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);

  // ------load roles info---------------------------
  useEffect(() => {
    (async () => {
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
  }, []);
  //---------- Handle Modal to Create/Update role  ------------------------------------
  const {
    isTrue,
    toggle
  } = useToggle();

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
        setUpdatedRole(role);
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
  //------ Handle Role delete ----------------------------------------
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
  const onSubmit = async (values) => {
    if (isUpdate) {
      try {
        const res = await httpClient.post(`/roles/update/${updatedRole.id}`, values);
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
        const res = await httpClient.post('/roles/create', values);
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
    <PageBreadcrumb subName="Apps" title="Role" />
    <PageMetaData title="Role" />
    <Row>
      <Col>
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap justify-content-between gap-3">
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
                    return <tr key={idx}>
                      <td>&nbsp;&nbsp;{idx + 1}</td>
                      <td>{role.name}</td>
                      <td>
                        <Button variant="soft-secondary" size="sm" className="me-2" onClick={() => { onUpdate(role.id) }}>
                          <IconifyIcon icon="bx:edit" className="fs-16" />
                        </Button>
                        <Button variant="soft-danger" size="sm" type="button" onClick={() => { handleDeleteClick(role.id) }}>
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
                  <span className="fw-semibold">52</span>&nbsp; roles
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
          {isUpdate ? 'Update' : 'Create'}
        </h5>
        <button type="button" className="btn-close" onClick={toggle} />
      </ModalHeader>
      <ModalBody>
        <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
          <TextFormInput control={control} name="name" containerClassName="mb-3" label="Name" id="name" placeholder="Enter your name" />
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
export default Role;