import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminScreenLayout from '../layout/AdminScreenLayout';
import AdminCard from '../components/AdminCard';
import AdminField from '../components/AdminField';
import AdminToggle from '../components/AdminToggle';
import AdminColorPicker from '../components/AdminColorPicker';
import AdminImagePicker from '../components/AdminImagePicker';
import CollapsibleSection from '../components/CollapsibleSection';
import { useAdminToast } from '../context/AdminToastContext';
import { useContent } from '@/context/ContentContext';

interface PlaceholderConfig {
  title: string;
  subtitle: string;
  field1Label: string;
  field1Help: string;
  field2Label: string;
  field2Help: string;
  defaultVal1: string;
  defaultVal2: string;
  previewNote: string;
}

export default function AdminPlaceholderScreen() {
  const location = useLocation();
  const toast = useAdminToast();
  const pathname = location.pathname;

  const currentPhone = useContent('global.links.phone', '0244753849');
  const currentLogo = useContent('global.logo.url', 'https://i.ibb.co/KgkfFKV/Santa-Logo.png');
  const currentBrand = useContent('global.brand.name', 'Santa Towing & Garage Services Ltd.');

  const configs: Record<string, PlaceholderConfig> = {
    '/admin/pages-text': {
      title: 'Pages & Text',
      subtitle: 'Edit headlines, body copy, service descriptions, and legal disclaimers.',
      field1Label: 'Homepage Hero Headline',
      field1Help: 'Primary headline visible when visitors land on santatowing.com.',
      field2Label: 'Emergency Guarantee Subtitle',
      field2Help: 'Customer commitment statement shown under emergency dispatch actions.',
      defaultVal1: '24/7 Rapid Emergency Towing & Haulage Across Ghana',
      defaultVal2: 'Guaranteed response times under 30 minutes in Accra and Kumasi metro regions.',
      previewNote: 'Hero Banner Headline & Copy',
    },
    '/admin/images': {
      title: 'Media & Images',
      subtitle: 'Manage photography for recovery vehicles, fleet haulers, and garage facilities.',
      field1Label: 'Towing Fleet Primary Photo',
      field1Help: 'Full-width photography asset shown in the service highlights gallery.',
      field2Label: 'Facility Workshop Photo',
      field2Help: 'Image showcasing certified mechanics and diagnostic equipment.',
      defaultVal1: 'https://i.ibb.co/gZh5x06r/Image-1-Towing-Vehicle.jpg',
      defaultVal2: 'https://i.ibb.co/0RDWpXBh/Image-8-Heavy-Duty-Recovery-Vehicle-or-Car.jpg',
      previewNote: 'Media Gallery Assets',
    },
    '/admin/inventory': {
      title: 'Inventory & Fleet',
      subtitle: 'Manage active rental vehicles, sales stock, and replacement auto parts catalog.',
      field1Label: 'Featured Vehicle Title',
      field1Help: 'Name and year of the primary vehicle highlighted on the rental showcase.',
      field2Label: 'Daily Rental Rate (GHS)',
      field2Help: 'Standard daily hire fee including comprehensive insurance and 24/7 backup.',
      defaultVal1: 'Toyota Land Cruiser Prado 2024 (4WD)',
      defaultVal2: '1,200 GHS / day',
      previewNote: 'Fleet Inventory Card',
    },
    '/admin/colors': {
      title: 'Brand Colors',
      subtitle: 'Define primary brand teal, dark background surfaces, and high-visibility alert accents.',
      field1Label: 'Primary Brand Color',
      field1Help: 'Dominant teal brand accent applied to navigation bars and primary buttons.',
      field2Label: 'Emergency Alert Accent',
      field2Help: 'High-contrast red shade reserved exclusively for urgent towing dispatches.',
      defaultVal1: '#015557',
      defaultVal2: '#d80000',
      previewNote: 'Color Palette Application',
    },
    '/admin/logo': {
      title: 'Brand Logo & Marks',
      subtitle: 'Manage the official Santa Towing company logo, wordmark, and browser favicon.',
      field1Label: 'Primary Header Logo URL',
      field1Help: 'Direct image link to high-resolution transparent PNG logo asset.',
      field2Label: 'Logo Accessible Alt Text',
      field2Help: 'Screen-reader description adhering to accessibility standards.',
      defaultVal1: currentLogo,
      defaultVal2: 'Santa Towing & Garage Services Ltd. Official Badge',
      previewNote: 'Header Brand Lockup',
    },
    '/admin/links': {
      title: 'Links & Social Media',
      subtitle: 'Update phone hotlines, WhatsApp direct link, email addresses, and social channels.',
      field1Label: 'Primary Emergency Phone',
      field1Help: 'Direct phone number connected to 24/7 towing dispatch room.',
      field2Label: 'WhatsApp Direct Chat Number',
      field2Help: 'WhatsApp business line for location sharing and vehicle photos.',
      defaultVal1: currentPhone,
      defaultVal2: '0244753849',
      previewNote: 'Contact & Social Shortcuts',
    },
    '/admin/profile': {
      title: 'Admin Profile & Security',
      subtitle: 'Manage your administrator account credentials, notifications, and security settings.',
      field1Label: 'Administrator Display Name',
      field1Help: 'Name displayed in audit logs and recent edit history.',
      field2Label: 'Notification Alert Email',
      field2Help: 'Email address where customer towing dispatch alerts are mirrored.',
      defaultVal1: 'Operations Admin Manager',
      defaultVal2: 'admin@santatowing.com',
      previewNote: 'Administrator Session Profile',
    },
  };

  const config = configs[pathname] || {
    title: 'Screen Settings',
    subtitle: 'Manage configuration settings for this section.',
    field1Label: 'Primary Label',
    field1Help: 'Help text explaining this setting.',
    field2Label: 'Secondary Label',
    field2Help: 'Help text explaining this setting.',
    defaultVal1: 'Default Value',
    defaultVal2: 'Default Secondary Value',
    previewNote: 'Content Preview',
  };

  const [val1, setVal1] = useState(config.defaultVal1);
  const [val2, setVal2] = useState(config.defaultVal2);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const hasUnsavedChanges = val1 !== config.defaultVal1 || val2 !== config.defaultVal2;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${config.title} settings saved successfully.`);
    }, 400);
  };

  const handleReset = () => {
    setVal1(config.defaultVal1);
    setVal2(config.defaultVal2);
    toast.info(`${config.title} form reset to default.`);
  };

  return (
    <AdminScreenLayout
      title={config.title}
      subtitle={config.subtitle}
      hasUnsavedChanges={hasUnsavedChanges}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
      saveLabel="Save section"
      resetLabel="Reset section"
      previewTitle={`${config.title} Live Preview`}
      preview={
        <div className="p-4 sm:p-5 space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              {config.previewNote}
            </span>
            <h4 className="text-sm font-bold text-slate-900 break-words">
              {val1}
            </h4>
            <p className="text-xs text-slate-600 mt-1 break-words">
              {val2}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Status</span>
            <span className="font-semibold text-[#015557] bg-emerald-50 px-2 py-0.5 rounded">
              {isActive ? 'Published Live' : 'Draft Mode'}
            </span>
          </div>
        </div>
      }
    >
      <AdminCard
        title="Configuration Parameters"
        subtitle="Manage settings for this module with live synchronization"
      >
        <div className="space-y-4">
          {pathname === '/admin/colors' ? (
            <>
              <AdminColorPicker
                label={config.field1Label}
                value={val1}
                onChange={setVal1}
                helpText={config.field1Help}
              />
              <AdminColorPicker
                label={config.field2Label}
                value={val2}
                onChange={setVal2}
                helpText={config.field2Help}
              />
            </>
          ) : pathname === '/admin/images' || pathname === '/admin/logo' ? (
            <>
              <AdminImagePicker
                label={config.field1Label}
                value={val1}
                onChange={setVal1}
                helpText={config.field1Help}
              />
              <AdminField
                label={config.field2Label}
                value={val2}
                onChange={setVal2}
                helpText={config.field2Help}
              />
            </>
          ) : (
            <>
              <AdminField
                label={config.field1Label}
                value={val1}
                onChange={setVal1}
                helpText={config.field1Help}
                type={val1.length > 50 ? 'textarea' : 'text'}
              />
              <AdminField
                label={config.field2Label}
                value={val2}
                onChange={setVal2}
                helpText={config.field2Help}
                type={val2.length > 50 ? 'textarea' : 'text'}
              />
            </>
          )}

          <AdminToggle
            label="Enable Section On Public Website"
            description="Toggle whether this content block is visible to road users and visitors."
            checked={isActive}
            onChange={setIsActive}
          />
        </div>
      </AdminCard>
    </AdminScreenLayout>
  );
}
