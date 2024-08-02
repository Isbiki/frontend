import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import * as yup from 'yup';
import SelectFormInput from '@/components/form/SelectFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import httpClient from '@/helpers/httpClient';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';

const postFormSchema = yup.object({
  title: yup.string().required(),
  subtitle: yup.string().optional(),
  category_id: yup.number().required(),
  breaking: yup.number().required()
});
const breakingCategories = [
  {
    value: 1,
    label: 'Yes'
  },
  {
    value: 0,
    label: 'No'
  }
];
const GeneralDetailsForm = () => {
  const [postDescription, setPostDescription] = useState(`<h2>Describe Your Post...</h2>`);
  const [categories, setCategories] = useState();
  const { user } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const [post, setPost] = useState();
  const { postId } = useParams();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(postFormSchema)
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await httpClient.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        } else {
          setCategories(null);
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
    fetchCategories();

    const getPost = async (id) => {
      try {
        const res = await httpClient.get(`/posts/${id}`);
        if (res.data.success) {
          setPost(res.data.post);
        } else {
          setPost(null);
        }
      } catch (e) {
        if (e.response?.data?.error) {
          showNotification({
            message: e.response?.data?.error,
            variant: 'danger'
          });
        }
        setPost(null);
      }
    };
    if (postId) getPost(postId);

  }, []);
  useEffect(() => {
    if (postId) {
      setValue('title', post?.title);
      setValue('subtitle', post?.subtitle);
      setValue('category_id', post?.category_id);
      setValue('breaking', post?.breaking);
      setPostDescription(post?.description);
    }
  }, [post]);

  const onSubmit = async (values) => {
    if (postId) {
      try {
        let req = { ...values, description: postDescription }
        const res = await httpClient.put(`/posts/${postId}`, req);
        if (res.data.success) {
          showNotification({
            message: 'Successfully Updated',
            variant: 'success'
          });
          navigate('/posts');
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
        let req = { ...values, description: postDescription, user_id: user.id }
        console.log(req)
        const res = await httpClient.post('/posts', req);
        console.log(res.data);
        if (res.data.success) {
          showNotification({
            message: 'Successfully created',
            variant: 'success'
          });
          navigate('/posts');
        }
        else {
          showNotification({
            message: res.data.message,
            variant: 'danger'
          });
          console.log(res.data.error)
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
  };

  const getCatsOptions = (cats) => {
    let ret = [];
    if (!cats) return [];
    cats.map((cat) => {
      ret = [...ret, { value: cat.id, label: cat.name }]
    });
    return ret;
  }

  return <form className="create-post-form" onSubmit={handleSubmit(onSubmit)}>
    <Row>
      <Col lg={12}>
        <TextFormInput control={control} label="Title" placeholder="Enter Title" containerClassName="mb-3" id="post-title" name="title" />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <TextFormInput control={control} name="subtitle" placeholder="Enter subtitle" label="Subtitle" containerClassName="mb-3" />
      </Col>
    </Row>
    <Row>
      <Col lg={6}>
        <label htmlFor="categories" className="form-label">Categories</label>
        <SelectFormInput required className="select2" control={control} name="category_id" options={getCatsOptions(categories)} />
      </Col>
      <Col lg={6}>
        <label htmlFor="breaking" className="form-label" >Breaking</label>
        <SelectFormInput required className="select2" control={control} name="breaking" options={breakingCategories} />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <div className="mb-5">
          <label className="form-label" style={{ marginTop: '15px' }} >Post Description</label>
          <ReactQuill theme="snow" style={{
            height: 195
          }} className="pb-sm-3 pb-5 pb-xl-0" modules={{
            toolbar: [[{
              font: []
            }, {
              size: []
            }], ['bold', 'italic', 'underline', 'strike'], [{
              color: []
            }, {
              background: []
            }], [{
              script: 'super'
            }, {
              script: 'sub'
            }], [{
              header: [false, 1, 2, 3, 4, 5, 6]
            }, 'blockquote', 'code-block'], [{
              list: 'ordered'
            }, {
              list: 'bullet'
            }, {
              indent: '-1'
            }, {
              indent: '+1'
            }], ['direction', {
              align: []
            }], ['link', 'image', 'video'], ['clean']]
          }} value={postDescription} name="description" onChange={(e) => setPostDescription(e)} />
        </div>
      </Col>
    </Row>
    <div className="d-flex flex-wrap gap-2 wizard justify-content-between mt-3">
      <div className="previous me-2"></div>
      <div className="next">
        <Button variant="secondary" onClick={() => { navigate('/posts'); }}>
          Cancel
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant="primary" type="submit">
          {postId ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  </form>;
};
export default GeneralDetailsForm;