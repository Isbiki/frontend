import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import * as yup from 'yup';
import SelectFormInput from '@/components/form/SelectFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { renameKeys } from '@/utils/rename-object-keys';
import { getAllProductCategories } from '@/helpers/data';
import { Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
const postFormSchema = yup.object({
  title: yup.string().required(),
  subtitle: yup.string().optional(),
  categories: yup.number().required(),
  breaking: yup.number().required(),
  description: yup.string().required()
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
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(postFormSchema)
  });
  const onSubmit = async (values) => {
    try {
      const res = await httpClient.post('/posts', values);
      if (res.data.success) {
        showNotification({
          message: 'Successfully created',
          variant: 'success'
        });
        navigate('/posts');
      }
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification({
          message: e.response?.data?.error,
          variant: 'danger'
        });
      }
    } finally {

    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllProductCategories();
      if (!data) return null;
      const categoryOptions = data.map(category => {
        return renameKeys(category, {
          id: 'value',
          name: 'label'
        });
      });
      setCategories(categoryOptions);
    };
    fetchCategories();
  }, []);
  return <form className="create-post-form" onSubmit={(handleSubmit(onSubmit))}>
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
        <SelectFormInput className="select2" control={control} name="categories" options={categories} />
      </Col>
      <Col lg={6}>
        <label htmlFor="breaking" className="form-label" >Breaking</label>
        <SelectFormInput className="select2" control={control} name="breaking" options={breakingCategories} />
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
          }} value={postDescription} onChange={() => { e.target.value }} />
        </div>
      </Col>
    </Row>
    <div className="d-flex flex-wrap gap-2 wizard justify-content-between mt-3">
      <div className="previous me-2"></div>
      <div className="next">
        <Button variant="primary" type="submit">
          Save
        </Button>
      </div>
    </div>
  </form>;
};
export default GeneralDetailsForm;