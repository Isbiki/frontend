import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import CreatePostForm from './components/CreatePostForm';
import PageMetaData from '@/components/PageTitle';
const CreatePost = () => {
  return <>
    <PageBreadcrumb title="Create Post" subName="Post" />
    <PageMetaData title="Create Post" />
    <Row>
      <Col>
        <Card>
          <CardBody>
            <CreatePostForm />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </>;
};
export default CreatePost;