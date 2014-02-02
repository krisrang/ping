require 'current_user'

module ApplicationHelper
  include CurrentUser
  
  def escape_unicode(javascript)
    if javascript
      javascript = javascript.scrub
      javascript.gsub!(/\342\200\250/u, '&#x2028;')
      javascript.gsub!(/(<\/)/u, '\u003C/')
      javascript.html_safe
    else
      ''
    end
  end

  def ping_csrf
    csrf_meta_tags if current_user
  end

  def flashes
    alerts = flash.keys.map do |key|
      type = key
      type = 'success' if key == :notice
      type = 'warning' if key == :alert

      "<div class='alert alert-#{type}'>#{flash[key]}</div>"
    end

    raw alerts.join("")
  end
end
