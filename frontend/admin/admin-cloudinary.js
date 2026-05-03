(function () {
  'use strict';

  if (window.AdminCloudinary) return;

  function toast(message, isError) {
    if (!message) return;
    if (typeof window.toast === 'function') {
      window.toast(message, !!isError);
      return;
    }
    if (typeof window.showToast === 'function') {
      window.showToast(message, !!isError);
      return;
    }
    if (isError) console.error(message);
    else console.log(message);
  }

  function setButtonBusy(button, isBusy, busyLabel) {
    if (!button) return;
    if (isBusy) {
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent || 'Delete';
      }
      button.disabled = true;
      button.textContent = busyLabel || 'Deleting...';
      return;
    }

    button.disabled = false;
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
  }

  function dispatchValueEvents(input) {
    if (!input) return;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getFieldLabel(input) {
    if (!input || !input.closest) return '';
    var field = input.closest('.f,.field,.form-field,td,.cld-widget,.block,.section-block,.modal-body,.bb');
    if (!field) return '';
    var label = field.querySelector('label');
    return normalizeText(label ? label.textContent : '');
  }

  function getNearbyText(input) {
    if (!input || !input.closest) return '';
    var scope = input.closest('.upload-row,.cld-url-row,.cld,.gal-slot,.block,.section-block,.modal-body,td,.form-field,.field,.f');
    return normalizeText(scope ? (scope.textContent || '') : '').toLowerCase();
  }

  function hasUploadContext(input) {
    if (!input) return false;

    var row = input.closest('.upload-row,.cld-url-row,.cld,.gal-slot');
    var scope = row || input.parentElement || input.closest('.field,.f,.form-field,td,.modal-body,.block,.section-block');
    if (!scope || !scope.querySelector) return false;

    if (scope.querySelector('input[type="file"]')) return true;

    return Array.prototype.slice.call(scope.querySelectorAll('button')).some(function (button) {
      return /upload/i.test(normalizeText(button.textContent || button.getAttribute('aria-label') || button.getAttribute('title') || ''));
    });
  }

  function isCloudinaryUrl(value) {
    try {
      var parsed = new URL(String(value || '').trim(), window.location.origin);
      return /(^|\.)cloudinary\.com$/i.test(parsed.hostname);
    } catch (error) {
      return false;
    }
  }

  function looksLikeCloudinaryField(input) {
    if (!input || input.dataset.cloudinaryDeleteIgnore === 'true') return false;

    var type = (input.getAttribute('type') || '').toLowerCase();
    if (type && type !== 'url' && input.dataset.role !== 'testimonial-photo-url') return false;

    var placeholder = String(input.getAttribute('placeholder') || '').toLowerCase();
    var value = String(input.value || '').toLowerCase();
    var nearby = getNearbyText(input);

    return /cloudinary|res\.cloudinary\.com/.test(placeholder)
      || isCloudinaryUrl(value)
      || /cloudinary/.test(nearby)
      || hasUploadContext(input);
  }

  async function requestDelete(url) {
    var headers = typeof window.apiHeaders === 'function'
      ? window.apiHeaders({ 'Content-Type': 'application/json' })
      : { 'Content-Type': 'application/json' };

    var response = await fetch('/api/upload', {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({ url: url })
    });
    var data = await response.json().catch(function () { return {}; });

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete from Cloudinary');
    }

    return data;
  }

  async function deleteByUrl(url, options) {
    var settings = options || {};
    var cleanUrl = String(url || '').trim();

    if (!cleanUrl) {
      toast(settings.emptyMessage || 'No Cloudinary file to delete.', true);
      return false;
    }

    if (!isCloudinaryUrl(cleanUrl)) {
      if (settings.allowMissingCloudinary) {
        if (typeof settings.onDeleted === 'function') {
          await settings.onDeleted(cleanUrl, { ok: false, skipped: true });
        }
        if (settings.successMessage) toast(settings.successMessage, false);
        return true;
      }
      if (settings.invalidMessage !== false) {
        toast(settings.invalidMessage || 'This field does not contain a Cloudinary URL.', true);
      }
      return false;
    }

    var confirmMessage = settings.confirmMessage;
    if (confirmMessage !== false) {
      var message = typeof confirmMessage === 'string'
        ? confirmMessage
        : 'Delete this file from Cloudinary?';
      if (!window.confirm(message)) return false;
    }

    setButtonBusy(settings.button, true, settings.busyLabel || 'Deleting...');

    try {
      var data = await requestDelete(cleanUrl);
      if (typeof settings.onDeleted === 'function') {
        await settings.onDeleted(cleanUrl, data);
      }
      if (settings.successMessage !== false) {
        toast(settings.successMessage || 'Deleted from Cloudinary. Save the page to keep this change.');
      }
      return true;
    } catch (error) {
      toast(error.message || 'Could not delete from Cloudinary.', true);
      return false;
    } finally {
      setButtonBusy(settings.button, false);
    }
  }

  async function deleteInputAsset(input, options) {
    var field = typeof input === 'string' ? document.querySelector(input) : input;
    var settings = options || {};

    if (!field) {
      toast('Cloudinary field not found.', true);
      return false;
    }

    var cleanUrl = String(settings.url || field.value || '').trim();
    return deleteByUrl(cleanUrl, Object.assign({}, settings, {
      onDeleted: async function (deletedUrl, data) {
        field.value = '';
        dispatchValueEvents(field);
        if (typeof settings.onDeleted === 'function') {
          await settings.onDeleted(deletedUrl, data);
        }
      }
    }));
  }

  function buildConfirmMessage(input) {
    var label = getFieldLabel(input);
    return label
      ? 'Delete the Cloudinary file for "' + label + '"?'
      : 'Delete this file from Cloudinary?';
  }

  function insertDeleteButton(input) {
    if (!looksLikeCloudinaryField(input) || input.dataset.cloudinaryDeleteEnhanced === 'true') return;
    input.dataset.cloudinaryDeleteEnhanced = 'true';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'loretto-cld-delete-btn';
    button.textContent = 'Delete';
    button.dataset.cloudinaryInlineDelete = 'true';

    button.addEventListener('click', function (event) {
      event.preventDefault();
      deleteInputAsset(input, {
        button: button,
        confirmMessage: buildConfirmMessage(input),
        successMessage: 'Deleted from Cloudinary. Save the page to keep this change.'
      });
    });

    var container = input.closest('.upload-row,.cld-url-row,.cld,.gal-slot') || input.parentElement;
    if (!container) return;
    container.appendChild(button);
  }

  function enhance(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('input').forEach(insertDeleteButton);
    if (root && root.matches && root.matches('input')) {
      insertDeleteButton(root);
    }
  }

  function bindDeleteButton(button, config) {
    if (!button || button.dataset.cloudinaryDeleteBound === 'true') return;
    button.dataset.cloudinaryDeleteBound = 'true';

    button.addEventListener('click', function (event) {
      event.preventDefault();

      var settings = typeof config === 'function' ? (config(button) || {}) : (config || {});
      if (settings.input) {
        deleteInputAsset(settings.input, Object.assign({}, settings, { button: button }));
        return;
      }
      if (settings.url) {
        deleteByUrl(settings.url, Object.assign({}, settings, { button: button }));
      }
    });
  }

  function injectStyles() {
    if (document.getElementById('loretto-cloudinary-delete-styles')) return;

    var style = document.createElement('style');
    style.id = 'loretto-cloudinary-delete-styles';
    style.textContent = [
      '.loretto-cld-delete-btn{flex-shrink:0;padding:7px 11px;border-radius:8px;cursor:pointer;background:rgba(231,76,60,.08);border:1.5px solid rgba(231,76,60,.22);color:#c0392b;font-family:Nunito,sans-serif;font-size:.7rem;font-weight:700;white-space:nowrap;transition:background .2s ease,border-color .2s ease,color .2s ease;margin-left:6px;}',
      '.loretto-cld-delete-btn:hover{background:rgba(231,76,60,.12);border-color:rgba(231,76,60,.3);color:#a93226;}',
      '.loretto-cld-delete-btn:disabled{opacity:.65;cursor:wait;}',
      '.gal-slot>.loretto-cld-delete-btn{margin:8px 0 0;align-self:flex-end;}'
    ].join('');
    document.head.appendChild(style);
  }

  function watch() {
    if (window.__lorettoCloudinaryObserver) return;

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          enhance(node);
        });
      });
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
    window.__lorettoCloudinaryObserver = observer;

    document.addEventListener('focusin', function (event) {
      if (event.target && event.target.tagName === 'INPUT') {
        insertDeleteButton(event.target);
      }
    });
  }

  async function uploadSingleImage(input, outputId) {
    if (!input.files || !input.files[0]) return;
    
    var outputField = typeof outputId === 'string' ? document.getElementById(outputId) : outputId;
    if (!outputField) {
      toast('Output field not found.', true);
      return;
    }

    toast('Uploading image...');
    var fd = new FormData();
    fd.append('file', input.files[0]);

    try {
      var res = await fetch('/api/upload', {
        method: 'POST',
        body: fd
      });
      var data = await res.json().catch(function() { return {}; });
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');

      outputField.value = data.url;
      dispatchValueEvents(outputField);
      toast('Image uploaded successfully!');
      return data.url;
    } catch (error) {
      toast(error.message || 'Upload failed', true);
    } finally {
      input.value = ''; // clear file input
    }
  }

  function triggerUpload(fileInputId) {
    var el = typeof fileInputId === 'string' ? document.getElementById(fileInputId) : fileInputId;
    if (el) el.click();
  }

  window.AdminCloudinary = {
    enhance: enhance,
    isCloudinaryUrl: isCloudinaryUrl,
    deleteByUrl: deleteByUrl,
    deleteInputAsset: deleteInputAsset,
    bindDeleteButton: bindDeleteButton,
    uploadSingleImage: uploadSingleImage,
    triggerUpload: triggerUpload,
    toast: toast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectStyles();
      enhance(document);
      watch();
    });
  } else {
    injectStyles();
    enhance(document);
    watch();
  }
})();
