FactoryBot.define do
  factory :vat, class: Tax do
    value { 21 }
    name { 'VAT' }
  end

  factory :retention, class: Tax do
    value { -15 }
    name { 'RETENTION' }
  end
end
