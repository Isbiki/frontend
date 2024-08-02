import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';
import { Modal, ModalBody, ModalFooter, ModalHeader, Pagination } from 'react-bootstrap';
import useToggle from '@/hooks/useToggle';
import TextFormInput from '@/components/form/TextFormInput';
import { useNotificationContext } from '@/context/useNotificationContext';
import AddMain from './AddMain';
import AddSub from './AddSub';
import { SERVER_URL } from '@/helpers/serverUrl';

const CategoriesPage = () => {
  const [categories, setCategories] = useState();
  const [updatedCategory, setUpdatedCategory] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [mainClicked, setMainClicked] = useState(false);
  const [subClicked, setSubClicked] = useState(false);

  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [items, setItems] = useState([]);
  const [dispNumber, setDispNumber] = useState(0);

  const { showNotification } = useNotificationContext();
  const { isTrue, toggle } = useToggle();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await httpClient.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
          let categoriesLength = res.data.categories ? res.data.categories.length : 0;
          let temp = Math.floor(categoriesLength / pageSize);
          setPageCount((categoriesLength / pageSize > temp) ? temp + 1 : temp);
          setPageNumber(1);
          if (categoriesLength <= pageSize) {
            setDispNumber(categoriesLength);
          }
          else {
            if (pageNumber < pageCount) {
              setDispNumber(pageSize);
            }
            else {
              setDispNumber(categoriesLength - (pageNumber - 1) * pageSize);
            }
          }
        } else {
          setCategories(null);
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
        setPageNumber(1);
        setPageCount(1);
        setDispNumber(0);
      }
    };
    fetchCategories();
    let categoriesLength = categories ? categories.length : 0;
    if (categoriesLength > 0) {
      let temp = Math.floor(categoriesLength / pageSize);
      setPageCount((categoriesLength / pageSize > temp) ? temp + 1 : temp);
      setPageNumber(1);
      if (categoriesLength <= pageSize) {
        setDispNumber(categoriesLength);
      }
      else {
        if (pageNumber < pageCount) {
          setDispNumber(pageSize);
        }
        else {
          setDispNumber(categoriesLength - (pageNumber - 1) * pageSize);
        }
      } console.log(pageCount)
    }
    else {
      setPageNumber(1);
      setPageCount(1);
      setDispNumber(0);
    }

  }, [isTrue]);

  const onUpdate = (id) => {
    setIsUpdate(true);
    categories.forEach((category, index) => {
      if (category.id === id) {
        setUpdatedCategory(category);
        if (category.kind) {
          setMainClicked(!mainClicked);
        }
        else {
          setSubClicked(!subClicked);
        }
      }
    });
  };

  // Handle category delete 
  const handleDeleteClick = (roleId) => {
    setCategoryIdToDelete(roleId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (categoryIdToDelete !== null) {
      onDelete(categoryIdToDelete);
      setShowConfirmModal(false);
      setCategoryIdToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setCategoryIdToDelete(null);
  };
  const onDelete = async (categoryId) => {
    try {
      const res = await httpClient.delete(`/categories/${categoryId}`);
      if (res.data.success) {
        showNotification({
          message: res.data.message,
          variant: 'success'
        });
        toggle();
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

  // -------- Pagination -------------
  useEffect(() => {
    let pages = [];
    for (let number = 1; number <= pageCount; number++) {
      pages.push(<Pagination.Item key={number} active={number === pageNumber} onClick={() => { setPageNumber(number) }}>
        {number}
      </Pagination.Item>);
    }
    setItems(pages);
    if (categories?.length > 0) {
      if (categories.length <= pageSize) {
        setDispNumber(categories.length);
      }
      else {
        if (pageNumber < pageCount) {
          setDispNumber(pageSize);
        }
        else {
          setDispNumber(categories.length - (pageNumber - 1) * pageSize);
        }
      }
    }
  }, [pageNumber, pageCount]);

  return <>
    <PageBreadcrumb subName="Apps" title="Categories" />
    <PageMetaData title="Categories" />
    <Row>
      <Col>
        <Card>
          <CardBody>
            <AddMain tableRefresh={toggle} isUpdate={isUpdate} updateClicked={mainClicked} selectedItem={updatedCategory} />
            &nbsp;&nbsp;&nbsp;
            <AddSub tableRefresh={toggle} categories={categories} isUpdate={isUpdate} updateClicked={subClicked} selectedItem={updatedCategory} />
          </CardBody>
          <div className="table-responsive table-centered">
            <table className="table text-nowrap mb-0">
              <thead className="bg-light bg-opacity-50">
                <tr>
                  <th className="border-0 py-2">&nbsp;&nbsp;ID</th>
                  <th className="border-0 py-2">Name</th>
                  <th className="border-0 py-2">M/S</th>
                  <th className="border-0 py-2">Parent</th>
                  <th className="border-0 py-2">Status</th>
                  <th className="border-0 py-2">Position</th>
                  <th className="border-0 py-2">Type1</th>
                  <th className="border-0 py-2">Type2</th>
                  <th className="border-0 py-2">Homepage</th>
                  <th className="border-0 py-2">Order</th>
                  <th className="border-0 py-2">Query</th>
                  <th className="border-0 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((cat, idx) => {
                  if (idx >= pageSize * (pageNumber - 1) && idx < pageSize * pageNumber) {
                    return (
                      <tr key={cat.id}>
                        <td>&nbsp;&nbsp;{idx + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <img src={SERVER_URL + cat.avatar} alt="avatar" className="avatar-sm rounded-circle" />
                            <div className="d-block">
                              <h5 className="mb-0 d-flex align-items-center gap-1">
                                {cat.name}
                              </h5>
                            </div>
                          </div>
                        </td>
                        <td>{cat.kind ? 'Main' : 'Sub'}</td>
                        <td>{cat.parent_name}</td>
                        <td>{cat.status ? 'Enabled' : 'Disabled'}</td>
                        <td>{cat.position ? 'Main' : 'More'}</td>
                        <td>{!cat.type1 ? 'Default' : 'Trading'}</td>
                        <td>{!cat.type2 ? 'News' : 'Article'}</td>
                        <td>{cat.homepage ? 'Yes' : 'No'}</td>
                        <td>{cat.sort_order}</td>
                        <td>{cat.data_query}</td>
                        <td>
                          <Button
                            variant="soft-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => onUpdate(cat.id)}
                          >
                            <IconifyIcon icon="bx:edit" className="fs-16" />
                          </Button>
                          <Button
                            variant="soft-danger"
                            size="sm"
                            type="button"
                            onClick={() => handleDeleteClick(cat.id)}
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
                <span className="fw-semibold">{categories ? categories.length : 0}</span>&nbsp; Categories
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
        </Card>
      </Col>
    </Row>

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
export default CategoriesPage;