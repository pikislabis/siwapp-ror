require 'rails_helper'

feature 'Invoices:' do
  scenario 'User can create an invoice. A customer is created.', :js do
    FactoryBot.create(:b_series)
    FactoryBot.create(:invoice, :paid)

    visit new_invoice_path

    fill_in 'invoice_name', with: 'Another Test Customer'
    fill_in 'invoice_identification', with: '54321'
    fill_in 'invoice_email', with: 'another@customer.com'
    fill_in 'invoice_invoicing_address', with: 'Fake Address'

    click_link 'Copy Invoicing Address'
    expect(find_field('invoice_shipping_address').value).to eq 'Fake Address'

    fill_in 'Issue date', with: Date.current
    fill_in 'Due date', with: Date.current >> 1

    # Fill in the item details manually instead of using autocomplete
    within(:xpath, '//*[@id="js-items-table"]/div[1]') do
      fill_in 'Description', with: 'Invoicing App Development'
      fill_in 'Quantity', with: '1.0'
      fill_in 'Price', with: '10000.0'

      # Check that taxes selector works for the default item...
      within '.invoice-col--taxes' do
        find('label').trigger('click')
      end
    end

    click_on 'Add Line'

    # Fill in the new item line created
    within(:xpath, '//*[@id="js-items-table"]/div[2]') do
      fill_in 'Description', with: 'Support'
      fill_in 'Quantity', with: '1'
      fill_in 'Price', with: '50'

      # Check that taxes selector works for the new item
      within '.invoice-col--taxes' do
        find('label').click
      end
    end

    click_on 'Save'

    expect(page.current_path).to eql invoices_path
    expect(page).to have_content('Invoice was successfully created.')
    expect(page).to have_content 'A-2'
    expect(page).to have_content '$ 10,050.00'

    expect(Customer.find_by(email: 'another@customer.com', identification: '54321')).not_to be_nil
  end

  scenario 'User can choose an existing customer via autocomplete', :js, skip: true do
    FactoryBot.create_list(:ncustomer, 5)

    visit new_invoice_path

    fill_in 'Name', with: 'hou'
    find('.ui-menu-item', text: 'Warehousing').click

    # and we should have data filled
    expect(find_field('invoice_name').value).to eq 'Warehousing'
    expect(find_field('invoice_email').value).to eq 'info@warehousing.com'
  end

  scenario "User can't create an invoice with no customer data or series", :js do
    visit new_invoice_path
    click_on 'Save'

    expect(page).to have_content '3 errors'
  end

  scenario 'Saving a draft', :js do
    FactoryBot.create(:series, :default)

    visit new_invoice_path

    fill_in 'invoice_name', with: 'Another Test Customer'
    fill_in 'invoice_identification', with: '54321'
    fill_in 'invoice_email', with: 'another@customer.com'
    fill_in 'invoice_invoicing_address', with: 'Fake Address'

    check 'invoice_draft'

    click_on 'Save'

    expect(page.current_path).to eql invoices_path
    expect(page).to have_content('Invoice was successfully created.')
    expect(page).to have_content 'A-[draft]'
  end
end
