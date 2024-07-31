import clsx from 'clsx';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import GeneralDetailsForm from './GeneralDetailsForm';
import ProductGalleryForm from './ProductGalleryForm';
const formSteps = [{
  index: 1,
  name: 'Post Content',
  icon: 'bxs:book',
  tab: <GeneralDetailsForm />
}, {
  index: 2,
  name: 'SEO Info',
  icon: 'bx:images',
  tab: <ProductGalleryForm />
}];
const CreatePostForm = () => {
  const [activeStep, setActiveStep] = useState(1);
  return <>
    <Tabs variant="underline" activeKey={activeStep} className="nav nav-tabs card-tabs" onSelect={e => setActiveStep(Number(e))}>
      {formSteps.map(step => <Tab key={step.index} eventKey={step.index} className="nav-item" tabClassName="pb-3" title={<span className="fw-semibold">
        <IconifyIcon icon={step.icon} className="me-1" />
        <span className="d-none d-sm-inline">{step.name}</span>
      </span>}>
        <>{step.tab}</>
      </Tab>)}
    </Tabs>

  </>;
};
export default CreatePostForm;