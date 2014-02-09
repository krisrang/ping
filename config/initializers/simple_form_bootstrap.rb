# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|
  config.wrappers :bootstrap, tag: 'div', class: 'form-group', role: 'form', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.use :label_input
    b.use :error, wrap_with: { tag: 'i', class: 'fa fa-exclamation-triangle form-control-feedback' }
    b.use :hint, wrap_with: { tag: 'span', class: 'help-block' }
  end

  config.wrappers :no_label, tag: 'div', class: 'form-group', role: 'form', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.use :input
    b.use :error, wrap_with: { tag: 'i', class: 'fa fa-exclamation-triangle form-control-feedback' }
    b.use :hint, wrap_with: { tag: 'span', class: 'help-block' }
  end

  config.input_class = 'form-control'

  # Wrappers for forms and inputs using the Twitter Bootstrap toolkit.
  # Check the Bootstrap docs (http://twitter.github.com/bootstrap)
  # to learn about the different styles for forms and inputs,
  # buttons and other elements.
  config.default_wrapper = :bootstrap
end
