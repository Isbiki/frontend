import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';
import { Modal, Pagination } from 'react-bootstrap';
import { useNotificationContext } from '@/context/useNotificationContext';

const Posts = () => {
  const [posts, setPosts] = useState();
  const [postCount, setPostCount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const [items, setItems] = useState([]);
  const [dispNumber, setDispNumber] = useState(0);

  const [refreshFlag, setRefreshFlag] = useState(true);

  const navigate = useNavigate();

  const {
    showNotification
  } = useNotificationContext();

  // ------- load posts ---------
  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get(`/posts?search=${searchKey}`);
        if (res.data.success) {
          setPosts(res.data.posts);
          let postsLength = res.data.posts.length;
          setostCount(postsLength);
          let temp = Math.floor(postsLength / pageSize);
          setPageCount((postsLength / pageSize > temp) ? temp + 1 : temp);
          if (postsLength <= pageSize) {
            setDispNumber(postsLength);
          }
          else {
            if (pageNumber < pageCount) {
              setDispNumber(pageSize);
            }
            else {
              setDispNumber(postsLength - (pageNumber - 1) * pageSize);
            }
          }
        }
        else {
          setPosts(null);
          setPostCount(0);
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

  //---------- Handle Create/Update post Modal ------------------------------------
  const onCreate = () => {
    navigate('/posts/create');
  }
  const onUpdate = (postId) => {

  };

  //------ Handle post delete ----------------------------------------
  const handleDeleteClick = (postId) => {
    setPostIdToDelete(postId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (postIdToDelete !== null) {
      onDelete(postIdToDelete);
      setShowConfirmModal(false);
      setPostIdToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setPostIdToDelete(null);
  };
  const onDelete = async (postId) => {
    try {
      const res = await httpClient.delete(`/posts/${postId}`);
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

  // -------- Pagination -------------
  useEffect(() => {
    let pages = [];
    for (let number = 1; number <= pageCount; number++) {
      pages.push(<Pagination.Item key={number} active={number === pageNumber} onClick={() => { setPageNumber(number) }}>
        {number}
      </Pagination.Item>);
    }
    setItems(pages);
    if (posts?.length > 0) {
      if (posts.length <= pageSize) {
        setDispNumber(posts.length);
      }
      else {
        if (pageNumber < pageCount) {
          setDispNumber(pageSize);
        }
        else {
          setDispNumber(posts.length - (pageNumber - 1) * pageSize);
        }
      }
    }
  }, [pageNumber, pageCount]);

  return <>
    <PageBreadcrumb subName="Apps" title="Post" />
    <PageMetaData title="post" />
    <Row>
      <Col>
        <Card>
          <CardBody>
            <div className="d-flex flex-wrap justify-content-between gap-3">
              <div className="search-bar">
                <span>
                  <IconifyIcon icon="bx:search-alt" />
                </span>
                <input type="search" className="form-control" id="search" value={searchKey} placeholder="Search post..." onChange={(e) => { setSearchKey(e.target.value) }} />
              </div>
              <div>
                <Button variant="primary" className="d-inline-flex align-items-center" onClick={() => { onCreate() }}>
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Create post
                </Button>
              </div>
            </div>
          </CardBody>
          <div>
            <div className="table-responsive table-centered">
              <table className="table text-nowrap mb-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="border-0 py-2">&nbsp;&nbsp;ID</th>
                    <th className="border-0 py-2">Title</th>
                    <th className="border-0 py-2">Category</th>
                    <th className="border-0 py-2">Author</th>
                    <th className="border-0 py-2">IsActive</th>
                    <th className="border-0 py-2">IsPopular</th>
                    <th className="border-0 py-2">IsBreaking</th>
                    <th className="border-0 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts?.map((post, idx) => {
                    if (idx >= pageSize * (pageNumber - 1) && idx < pageSize * pageNumber) {
                      return (
                        <tr key={post.id}>
                          <td>&nbsp;&nbsp;{post.id}</td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <div className="d-block">
                                <h5 className="mb-0 d-flex align-items-center gap-1">
                                  {post.title}
                                </h5>
                              </div>
                            </div>
                          </td>
                          <td>{post.category}</td>
                          <td>{post.authorName}</td>
                          <td>{post.isActive}</td>
                          <td>{post.isPopular}</td>
                          <td>{post.isBreaking}</td>
                          <td>
                            <Button
                              variant="soft-secondary"
                              size="sm"
                              className="me-2"
                              onClick={() => onUpdate(post.id)}
                            >
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              type="button"
                              onClick={() => handleDeleteClick(post.id)}
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
                  <span className="fw-semibold">{postCount}</span>&nbsp; posts
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

    <Modal show={showConfirmModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
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
export default Posts;