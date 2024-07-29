import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';

const User = () => {
  const [users, setUsers] = useState();
  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get('/users');
        console.log(res);
        if (res.data.success) {
          setUsers(res.data.data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e) {
        if (e.response?.data?.error) {
          showNotification({
            message: e.response?.data?.error,
            variant: 'danger'
          });
        }
      } finally {

      }

    })();
  }, []);
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
                <input type="search" className="form-control" id="search" placeholder="Search user..." />
              </div>
              <div>
                <Button variant="primary" className="d-inline-flex align-items-center">
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
                    <th className="border-0 py-2">Id</th>
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
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="form-check form-User ps-4">
                            {user.id}
                          </div>
                        </div>
                      </td>
                      <td>
                        {user.name}
                      </td>
                      <td>{user.email}</td>
                      <td >
                        {user.role_name}
                      </td>
                      <td>
                        {user.created_at}&nbsp;
                      </td>
                      <td>
                        <Button variant="soft-secondary" size="sm" className="me-2">
                          <IconifyIcon icon="bx:edit" className="fs-16" />
                        </Button>
                        <Button variant="soft-danger" size="sm" type="button">
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
  </>;
};
export default User;